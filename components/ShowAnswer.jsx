import React, {useState} from "react";
import {candidates} from "../helpers/utils";
import useTranslation from "next-translate/useTranslation";

import styles from "./ShowAnswer.module.scss";

export default function ShowAnswer(props) {
  const {ids, open = false} = props;
  const [isOpen, setIsOpen] = useState(open);
  const {t} = useTranslation("translation");
  
  const data = candidates.filter(d => ids.map(h => h.id).includes(d.id));
  data.forEach(d => {
    const h = ids.find(x => x.id === d.id);
    d.proposal = h.proposal;
    d.sourceLink = h.sourceLink;
  });

  return <div className={styles.answer}>
    {!open && <button
      className={styles.toggle}
      onClick={() => setIsOpen(!isOpen)}
    >
      {!isOpen ? t("daccordle.show-answers") : t("daccordle.hide-answers")}
    </button>}
    {/* <h2>Answers</h2> */}
    {isOpen && data.map((d, i) => {
      const name = d.name;
      return <div
        className={styles.candidate}
        key={`answer_candidate_${i}`}
      >
        <div className={styles.side}>
          <img className={styles.photo} src={d.photo} alt="" />
        </div>
        <div className={styles.main}>
          <h3 className={styles.title}>{name}</h3>
          <p className={styles.proposal} dangerouslySetInnerHTML={{__html: "\""+d.proposal+"\""}} />
          <p></p>
          <a href={d.sourceLink}>{t("daccordle.check_program")}</a>
        </div>
      </div>;
    })}
  </div>;
}