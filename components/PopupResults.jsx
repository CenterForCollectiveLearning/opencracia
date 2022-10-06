import {Dialog} from "@blueprintjs/core";
import {async} from "d3plus-color";
import React, {useCallback, useEffect, useState} from "react";
import {Rank} from "../pages/results";
import {usePlausible} from "next-plausible";
import useTranslation from "next-translate/useTranslation";

import styles from "./PopupResults.module.scss";

export default function PopupResults(props) {
  const [data, setData] = useState([]);
  const {callback, isOpen} = props;
  const {t, lang} = useTranslation("translation");
  const plausible = usePlausible();
  
  useEffect(async() => {
    const proposals = await fetch("/api/proposals").then(resp => resp.json());

    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        user_id: localStorage.getItem("mptoken")
      })
    };
    const {data, count} = await fetch("/api/ranking", requestOptions).then(resp => resp.json());

    // console.log(proposals);
    // const output = data;
    data.forEach(d => {
      const tmp = proposals.find(h => h.id * 1 === d.id * 1) || {};
      d.name = tmp[lang];
    });
    
    setData(data);
  }, []);


  return <Dialog
    isOpen={isOpen}
    title={t("results.my-ranking-title")}
    onClose={() => {
      plausible("index.results");
      callback(false);
    }}
  >
    <div className={styles.dialogbody}>
      <Rank
        data={data}
        footnote={undefined}
        title={undefined}
        display={false}
        value="value"
        backgroundColor="#0055A4"
      />
    </div>
  </Dialog>;
}