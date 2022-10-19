from pickletools import float8
import numpy as np
import os
import pandas as pd
import simplejson as json
import tqdm
from datetime import datetime, timezone
from sqlalchemy import create_engine
from urllib.parse import quote 

# ENV_VAR = os.getenv("DATABASE_URL", None)
ENV_VAR = "postgresql://user_br:%s@localhost:5432/db_escolhe_ai_2022"%quote('br@zild@t@2022')
engine = create_engine(ENV_VAR)

df1 = pd.read_sql_query("SELECT * FROM agree WHERE score > 0.7 AND agree != -1", con=engine)

df1["agree"] = df1["agree"].astype(int)
df1["universe"] = df1["universe"].astype(int)

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

df_disagreement = df1[(df1["universe"] > 3) & (df1["agree"] >= 0)]\
    .groupby(["proposal_id"]).agg({"agree": "std", "id": "count"})\
    .reset_index()

df_disagreement["proposal_id"] = df_disagreement["proposal_id"].astype(int)
df_disagreement = df_disagreement[["proposal_id", "agree", "id"]]
df_disagreement.columns = ["id", "divisiveness", "count"]
df_disagreement["id"] = df_disagreement["id"].astype(np.int16)
df_disagreement["count"] = df_disagreement["count"].astype(np.int16)
df_disagreement["divisiveness"] = df_disagreement["divisiveness"].round(4)

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

    return pd.DataFrame(win_rate).reset_index().rename(columns={"option_target": "id", 0: "agreement"})

df_agreement = win_rate(df)

output = pd.merge(df_agreement, df_disagreement, on="id", how="outer")

data = {
    "data": output.to_dict("records"),
    "datetime": str(datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
    "count": int(df_disagreement["count"].sum()),
    "participants": int(len(df1["user_id"].unique()))
}

location = os.path.dirname(os.path.abspath(__file__))
location = location.replace("scripts", "public/results.json")
with open(location, "w", encoding="utf-8") as f:
    json.dump(data, f, ignore_nan=True) 
