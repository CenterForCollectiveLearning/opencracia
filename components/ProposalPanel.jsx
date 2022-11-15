import classNames from "classnames";
import React, {useState} from "react";
import {BsArrowRight, BsChevronBarRight} from "react-icons/bs";
import {FaAngleDown, FaAngleRight} from "react-icons/fa";
import Proposal from "./Proposal";
import {usePlausible} from "next-plausible";
import useTranslation from "next-translate/useTranslation";

import styles from "./ProposalPanel.module.scss";

function Subpanel(props) {
  const {data, lang, open, title} = props;
  const [isOpen, setIsOpen] = useState(true);
  
  return <div className={styles.subpanel}>
    <h2 className={styles.title}
      // onClick={() => setIsOpen(!isOpen)}
    >
      {/* {!isOpen ? <FaAngleRight /> : <FaAngleDown />} */}
      {title}
    </h2>
    {isOpen && <div className={styles.alternatives}>
      {data.map(h => <Proposal
        key={h.id}
        name={h[lang]}
        options={h[`${lang}_multichoice`]}
      />)}
    </div>}
  </div>;
}

export default function ProposalPanel(props) {
  const {lang, data} = props;
  const {t} = useTranslation("translation");
  const [filtered, setFiltered] = useState([t("text.all")]);

  const orderedData = data.reduce((obj, d) => { 
    if (!obj[d[lang+"_category"]]) obj[d[lang+"_category"]] = [];
    obj[d[lang+"_category"]].push(d);

    return obj;
  }, {});

  return <div className={styles.proposalpanel}>
    <div className={styles.categories}>
      {[t("text.all")].concat(Object.keys(orderedData)).map((d, i) => {
        const some = filtered.some(h => h === d);
        return <button
          className={classNames(styles.category, {[styles.selected]: some})}
          key={`proposal_category_${i}`}
          // onClick={() => {
          //   let tmp = filtered.filter(h => h !== d);
          //   if (d !== t("text.all") && some) tmp = filtered.filter(h => h !== d);
          //   else if (d !==s t("text.all")) tmp = filtered.filter(h => h !== t("text.all"));
          //   else tmp = [];
          //   setFiltered(some
          //     ? d === t("text.all") || tmp.length === 0 ? [t("text.all")] : tmp
          //     : tmp.concat(d));
          // }}
          onClick={() => {
            setFiltered([d]); 
          }}
        >{d}</button>;})}
    </div>
    {Object.entries(orderedData).filter(d => filtered.includes(d[0]) || filtered.includes(t("text.all"))).map((d, i) => {
      d[1].sort((a, b) => a[lang].localeCompare(b[lang]));
      return <Subpanel
        key={`${i}_subpanel`}
        lang={lang}
        title={d[0]}
        open={true}
        data={d[1] || []}
      />;
    })}
  </div>;
}
