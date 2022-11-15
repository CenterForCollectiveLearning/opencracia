import React from "react";
import {useState} from "react";
import classNames from "classnames";

import {FaCheck} from "react-icons/fa";
import {BsCheckLg, BsDashCircleFill, BsDashLg, BsXLg} from "react-icons/bs";


import styles from "./CardAgree.module.scss";
import useTranslation from "next-translate/useTranslation";

export default function CardAgree(props) {
  const [selected, setSelected] = useState(undefined);
  const [subselected, setSubselected] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const {callback, item, lang} = props;
  const {t} = useTranslation("translation");
  const {multichoice} = item;
  const name = item[lang];
  const options = item[`${lang}_multichoice`] || [];
  return <div className={styles.card}>
    <div className={styles.cardagree}>
      <span className={styles.label}>{name}</span>
      <div className={styles.buttons}>
        <button
          className={classNames(styles.button, styles.agree, {[styles.selected]: selected === 1})}
          onClick={() => {
            const option = 1;
            setSelected(option);
            setIsOpen(true);
            setSubselected(undefined);
            callback({id: item.id.toString(), name, selected: option, option: null});
          }}><BsCheckLg /></button>
        <button
          className={classNames(styles.button, styles.disagree, {[styles.selected]: selected === -1})}
          onClick={() => {
            const option = -1;
            setSelected(option);
            setIsOpen(false);
            setSubselected(undefined);
            callback({id: item.id.toString(), name, selected: option, option: null});
          }}><BsXLg /></button>
        <button
          className={classNames(styles.button, styles.skip, {[styles.selected]: selected === 0})}
          onClick={() => {
            const option = 0;
            setSelected(option);
            setIsOpen(false);
            setSubselected(undefined);
            callback({id: item.id.toString(), name, selected: option, option: null});
          }}>
          {/* <BsDashLg /> */}
          {t("text.blanc")}
        </button>
      </div>
    </div>
    {(isOpen && selected !== -1 ) && <div className={styles.options}>
      {options.map((d, i) => <span
        className={classNames(styles.option, {[styles.selected]: subselected === d})}
        onClick={() => {
          setSubselected(d);
          callback({id: item.id.toString(), name, selected: 1, option: d});
        }}
        key={`${name}_${i}`}>
        {d}
      </span>)}
    </div>}
  </div>;
}