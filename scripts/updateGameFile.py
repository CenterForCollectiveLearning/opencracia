from pickletools import float8
import numpy as np
import os
import pandas as pd
import json
from datetime import datetime
from sqlalchemy import create_engine
from urllib.parse import quote  
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

# ENV_VAR = os.getenv("DATABASE_URL", None)
ENV_VAR = "postgresql://user_br:%s@localhost:5432/db_escolhe_ai_2022"%quote('br@zild@t@2022')
engine = create_engine(ENV_VAR)

candidates__ = {
    "Bolsonaro" : 1,
    "Lula" : 2,
    "Ciro" : 3,
    "Simone" : 4,
    "d'Avila" : 5,
    "Soraya" : 6,
}

def replace_id(x):
    for c in str(x).split(";"):
        x = str(x).replace(c, str(candidates__[c]))
    return x

filename_prop_cand = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrCKrBSvYK6Fi9zrI8zBpoo3nWJs7LHWoOkPHr4bp70RDBPErnTla3ECSHN2-oyA/pub?gid=1937868951&single=true&output=tsv"
alternatives = pd.read_csv(filename_prop_cand, delimiter="\t", lineterminator='\n')
alternatives.drop(columns=alternatives.columns[-3:], inplace=True)
alternatives = alternatives[alternatives['proposal_id'].notna()]
alternatives['proposal_id'] = alternatives['proposal_id'].astype(int)
alternatives['candidate_ids'] = alternatives['candidate_ids'].apply(lambda x: replace_id(x))
alternatives[['proposal_id','candidate_ids','start_date','source_link','source_text']].to_sql('game', con=engine, if_exists='replace')
