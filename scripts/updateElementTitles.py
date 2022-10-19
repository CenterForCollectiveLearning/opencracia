import json
import pandas as pd
import os
os.path.dirname(os.getcwd())

df = pd.read_csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vScHeBN1LHDdbr0ShvDFOWdK8tn-CGRkfz_vBv8DNWFn4TyUbIVBBd71iMBmxxaNIgq_evznXOKpXnJ/pub?gid=414052729&single=true&output=tsv", delimiter="\t")
df.head()

def generate_file(lang = "en", default_lang = "en"):
    d = {}

    for i, row in df.iterrows():
        itm, sitm = row["key"].split(".")
        if itm not in d:
            d[itm] = {}
            
        d[itm][sitm] = row[default_lang] if pd.isnull(row[lang]) else row[lang]
        
    print("d",d)
    return d

for lang in ["en","pt","fr", "es"]:
    with open(f"locales/{lang}/translation.json", "w") as fp:
        json.dump(generate_file(lang, "en"), fp, ensure_ascii=False)