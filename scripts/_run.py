import numpy as np
import os
import pandas as pd
import simplejson as json
import tqdm
from datetime import datetime, timezone
from sqlalchemy import create_engine


ENV_VAR = os.getenv("DATABASE_URL", None)
engine = create_engine(ENV_VAR)

df = pd.read_sql_query("SELECT * FROM preferences WHERE selected > 0 AND score > 0.7", con=engine)

df["option_a_sorted"] = df[["option_a", "option_b"]].min(axis=1)
df["option_b_sorted"] = df[["option_a", "option_b"]].max(axis=1)
df["card_id"] = 1000000 + df["option_a_sorted"] * 1000 + df["option_b_sorted"]

a = df[["option_a", "option_b", "selected"]].values
df["option_source"] = np.where(a[:, 1] == a[:, 2], a[:, 0], a[:, 1])
df["option_target"] = np.where(a[:, 0] == a[:, 2], a[:, 0], a[:, 1])

def win_rate(df):
    dd = df.groupby(["option_source", "option_target"]).agg({"uuid": "count"}).reset_index()
    m = dd.pivot(index="option_source", columns="option_target", values="uuid").fillna(0)
    ids = set(df["option_source"]) | set(df["option_target"])
    m = m.reindex(ids)
    m = m.reindex(ids, axis=1)
    m = m.fillna(0)

    r = m + m.T
    win_rate = m.sum() / r.sum()

    return pd.DataFrame(win_rate).reset_index().rename(columns={"option_target": "id", 0: "mean"})

def divisiveness(data, full=False):
    dd = data[(data["option_a"] == data["selected"]) | (data["option_b"] == data["selected"])]\
      .groupby(["card_id", "selected", "uuid"])\
      .agg({"id": "count"})

    # Generates list of users associated with each proposal pair
    a = []
    _data = data.copy().set_index("uuid")

    for idx, df_select in tqdm.tqdm(dd.groupby(level=[0, 1]), position=0, leave=True):
        card_id = idx[0]
        selected = idx[1]
        users = [item[2] for item in df_select.index.to_numpy()]
        # print(card_id, selected, users)

        data_temp = _data.loc[users]
        df_bs = win_rate(data_temp.reset_index()).dropna()
        df_bs["card_id"] = card_id
        df_bs["selected"] = selected

        a.append(df_bs)
        del users, df_bs, data_temp

    df_rank_bs = pd.concat(a)
    # df_rank_bs = df_rank_bs.replace([np.inf, -np.inf], np.nan).dropna().sort_values("mean")

    df_cards = df_rank_bs.groupby(["card_id", "selected", "id"]).agg({"mean": "mean"}).reset_index()
    df_cards["option_b_sorted"] = df_cards["card_id"] % 1000
    df_cards["option_a_sorted"] = ((df_cards["card_id"] - 1000000 - df_cards["option_b_sorted"]) / 1000).astype(int)
    df_cards["group"] = df_cards["option_a_sorted"] == df_cards["selected"]

    # df_cards.columns = [col[1] or col[0] for col in df_cards.columns]
    df_cards["group"] = df_cards["group"].replace({True: "A", False: "B"})

    df_a = df_cards[df_cards["group"] == "A"]
    df_b = df_cards[df_cards["group"] == "B"]

    df_div = pd.merge(df_a, df_b, 
                      on=["card_id", "id", "option_a_sorted", "option_b_sorted"], 
                      suffixes=("_a", "_b"))

    df_div = df_div[["id", "card_id", "mean_a", "mean_b", "selected_a", "selected_b"]]#.replace([np.inf, -np.inf], np.nan).dropna()

    df_div["diff_abs"] = abs(df_div["mean_a"] - df_div["mean_b"])

    if full:
        df_divisiveness = df_div.groupby("id").agg({"diff_abs": "mean"}).reset_index()\
            .rename(columns={"diff_abs": "divisiveness"})

        return df_divisiveness

    else:
        frag_a = df_div[["id", "selected_a", "diff_abs"]].rename(columns={"selected_a": "selected"})
        frag_b = df_div[["id", "selected_b", "diff_abs"]].rename(columns={"selected_b": "selected"})
        frag_c = pd.concat([frag_a, frag_b])
        frag_c = frag_c[frag_c["id"] == frag_c["selected"]]
        frag_c = frag_c.groupby("id").agg({"diff_abs": "mean"}).reset_index()\
            .rename(columns={"diff_abs": "divisiveness"})
        
        return frag_c

df_agreement = win_rate(df)
df_disagreement = divisiveness(df)

output = pd.merge(df_agreement, df_disagreement, on="id", how="outer")
output = output.rename(columns={"mean": "agreement"})

df_count = pd.concat([pd.Series(df["option_a"].values), pd.Series(df["option_b"].values)])
df_count = pd.DataFrame(df_count, columns=["id"]).reset_index().rename(columns={"index": "count"})
df_count = df_count.groupby("id").agg({"count": "count"}).reset_index()
output = pd.merge(output, df_count, on="id")

response = output.to_dict("records")
data = {
    "data": response,
    "datetime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "count": df.shape[0],
    "participants": len(df["uuid"].unique())
}

location = os.path.dirname(os.path.abspath(__file__))
location = location.replace("scripts", "public/results.json")
with open(location, "w", encoding="utf-8") as f:
    json.dump(data, f, ignore_nan=True) 