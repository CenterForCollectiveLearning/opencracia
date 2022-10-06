from pickletools import float8
import numpy as np
import os
import pandas as pd
import json
from datetime import datetime
from sqlalchemy import create_engine

import ssl

ssl._create_default_https_context = ssl._create_unverified_context

# ENV_VAR = os.getenv("DATABASE_URL", None)
ENV_VAR = "postgresql://user_mp:v#?YERrN924ec^y+@localhost:5432/db_mon_programme"
engine = create_engine(ENV_VAR)

# df1 = pd.read_sql_query("SELECT DISTINCT * FROM game", con=engine)
# already_played = []
# if len(df1) > 0:
#     df1["proposal_id"] = df1["proposal_id"].astype(int)
#     already_played = list(df1["proposal_id"].astype(int).unique())

filename_prop_cand = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4gIavqKNazbpM6YhZJsnPeGdQt_SOgCrPirNLiULSp18MjTL4AlttpCc8Tjb9OPpynb6X4dbac4_o/pub?gid=1505112015&single=true&output=tsv"
proposals = pd.read_csv(filename_prop_cand, delimiter="\t")
proposals['proposal_id'] = proposals['proposal_id'].astype(int)
# proposals['candidate_ids'] = proposals['candidate_ids'].apply(lambda x: [int(xi) for xi in x.split(";")])
# print(proposals)
# location = os.path.dirname(os.path.abspath(__file__))
# location = location.replace("scripts", "public/results.json")
# with open(location, "r") as read_file:
#     data = json.load(read_file)

# disagreements = pd.read_json(data["data"], orient='records')
# disagreements['id'] = disagreements['id'].astype(int)
# sorted_proposals = disagreements[~disagreements['id'].isin(already_played)].sort_values(by='divisiveness', ascending=False)['id'].values

# proposals[proposals['proposal_id']==sorted_proposals[0]].head(1).to_sql('game', con=engine, if_exists='replace')
proposals[['proposal_id','candidate_ids','start_date','source_link','source_text']].to_sql('game', con=engine, if_exists='replace')
