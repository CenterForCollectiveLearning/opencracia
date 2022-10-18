import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar";

import useTranslation from "next-translate/useTranslation";
import ProposalPanel from "../components/ProposalPanel";
import Loading from "../components/Loading";

export default function Proposals() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const {lang, t} = useTranslation("translation");
  
  useEffect(async() => {
    const tmp = await fetch("/api/proposals").then(resp => resp.json());

    const tmpObj = tmp.reduce((obj, d) => {
      const label = d[`${lang}_category`];
      if (label !== ""){
        if (!obj[label]) obj[label] = [];
        obj[label].push(d);
      }
      return obj;
    }, {});

    setData(tmpObj);
    setLoading(false);
  }, []);

  const title = <h1 className="title">{t("menu.proposals")}</h1>;
  const nav =<Navbar
    hmTitle={`${t("menu.proposals")} / ${t("website.name")}`}
    selected="proposals" />;

  if (loading) {
    return <>
      {nav}
      {title}
      <Loading label={t("messages.loading")} />
    </>;
  };

  return <>
    {nav}
    {title}
    <div className="container">

      <div className="columns">
        <div className="column">

          <ProposalPanel
            lang={lang}
            data={data}
          />
        </div>
      </div>
    </div>
  </>;
}