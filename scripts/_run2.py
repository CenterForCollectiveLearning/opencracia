import numpy as np
import os
import pandas as pd
import simplejson as json
import tqdm
from datetime import datetime, timezone
from sqlalchemy import create_engine

# ENV_VAR = os.getenv("DATABASE_URL", None)
ENV_VAR = "postgresql://user_mp:v#?YERrN924ec^y+@localhost:5432/db_mon_programme"
engine = create_engine(ENV_VAR)

df1 = pd.read_sql_query("SELECT * FROM agree WHERE score > 0.7 AND agree != -1", con=engine)

output = []
for user_id, tmp in df1.groupby("user_id"):

    tmp_agree = tmp[tmp["agree"] == 1]
    tmp_disagree = tmp[tmp["agree"] == 0]
    
    a = tmp_agree["proposal_id"].unique()
    b = tmp_disagree["proposal_id"].unique()
    
    df_tmp = pd.DataFrame([(i, j) for i in a for j in b], columns=["option_a", "option_b"])
    df_tmp["user_id"] = user_id
    output.append(df_tmp)
    
df_a = pd.concat(output).reset_index(drop=True)
df_a["selected"] = df_a["option_a"]

df2 = pd.read_sql_query("SELECT * FROM rank WHERE score > 0.7", con=engine)
df2 = df2[df2["rank"].str.contains(">")].copy()

from itertools import combinations

output = []
for row in df2.itertuples():
    df_tmp = pd.DataFrame(list(combinations(row.rank.split(">"), 2)), columns=["option_a", "option_b"])
    df_tmp["user_id"] = row.user_id
    output.append(df_tmp)
    
df_b = pd.concat(output).reset_index(drop=True)
df_b["selected"] = df_b["option_a"]

df = pd.concat([df_a, df_b]).reset_index(drop=True)
df["option_a"] = df["option_a"].astype(int)
df["option_b"] = df["option_b"].astype(int)
df["id"] = range(1, df.shape[0] + 1)

df["option_a_sorted"] = df[["option_a", "option_b"]].min(axis=1).astype(int)
df["option_b_sorted"] = df[["option_a", "option_b"]].max(axis=1).astype(int)
df["card_id"] = df["option_a_sorted"].astype(str) + "-" + df["option_b_sorted"].astype(str)

a = df[["option_a", "option_b", "selected"]].values
df["option_source"] = np.where(a[:, 1] == a[:, 2], a[:, 0], a[:, 1])
df["option_target"] = np.where(a[:, 0] == a[:, 2], a[:, 0], a[:, 1])

def win_rate(df):
    dd = df.groupby(["option_source", "option_target"]).agg({"user_id": "count"}).reset_index()
    m = dd.pivot(index="option_source", columns="option_target", values="user_id").fillna(0)
    ids = set(df["option_source"]) | set(df["option_target"])
    m = m.reindex(ids)
    m = m.reindex(ids, axis=1)
    m = m.fillna(0)

    r = m + m.T
    win_rate = m.sum() / r.sum()

    return pd.DataFrame(win_rate).reset_index().rename(columns={"option_target": "id", 0: "mean"})

def divisiveness(data, full=False):
    dd = data[(data["option_a"] == data["selected"]) | (data["option_b"] == data["selected"])]\
      .groupby(["card_id", "selected", "user_id"])\
      .agg({"id": "count"})

    # Generates list of users associated with each proposal pair
    a = []
    _data = data.copy().set_index("user_id")

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
    df_cards["option_b_sorted"] = df_cards["card_id"].str.split("-").apply(lambda x: x[1])
    df_cards["option_a_sorted"] = df_cards["card_id"].str.split("-").apply(lambda x: x[0])
    df_cards["group"] = df_cards["option_a_sorted"].astype(str) == df_cards["selected"].astype(str)

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
    "participants": len(df["user_id"].unique())
}

location = os.path.dirname(os.path.abspath(__file__))
location = location.replace("scripts", "public/results.json")
with open(location, "w", encoding="utf-8") as f:
    json.dump(data, f, ignore_nan=True) 