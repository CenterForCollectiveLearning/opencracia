import React, {useState} from "react";
import CardAgree from "../components/CardAgree";
import useTranslation from "next-translate/useTranslation";
import classNames from "classnames";
import {useSelector} from "react-redux";
import {random, shuffle} from "../helpers/utils";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";

import styles from "./Approval.module.scss";
import store, {properties, users} from "../store/store";

const sample = (array, n) => {
  const shuffled = shuffle(array);
  return shuffled.slice(0, n);
};

export default function Approval(props) {
  const {callback, data, dataSelectedAll, isFallback=false} = props;
  const [state, setState] = useState({
    selected: [],
    selectedAll: dataSelectedAll
  });
  const {selected, selectedAll} = state;
  
  const {lang, t} = useTranslation("translation");
  const {token} = useSelector(state => state.users);
  const {ballotSize, subBallotPos, collectData} = useSelector(state => state.properties);
  const {executeRecaptcha} = useGoogleReCaptcha();
  
  const setData = async(data, newState) => {
    const _token = await executeRecaptcha("action");
    const addMemory = data.map(d => ({
      id: d.id,
      module: "approval",
      selected: d.selected
    }));
    store.dispatch(properties.actions.updateMemory(addMemory));
  
    // After N panels, display self-reported form
    const userId = token;
    const tmp = data.map(d => [userId, d.id * 1, d.selected, ballotSize, lang, d.option]);
    
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({data: tmp, token: _token})
    };
    
    if (collectData === true) {
      fetch("/api/createAgree", requestOptions);
    }

    window.scrollTo(0, 0);
    setState(newState);
    if (!isFallback)
      store.dispatch(properties.actions.updateSubBallotPos(subBallotPos + 1));
    else 
      callback();
  };

  return <main className={styles.main}>
    <div className={styles.comparison}>
      {data.map((d, i) => <CardAgree
        key={`card_agree_${d.id}`}
        item={d}
        lang={lang}
        callback={item => {
          const tmp = selected.filter(d => d.id !== item.id);
          const tmpAll = selectedAll.filter(d => d.id !== item.id);
          setState({
            ...state,
            selected: tmp.concat(item),
            selectedAll: tmpAll.concat(item)
          });
        }}
      />)}
    </div>
    <div 
      className={styles.comparison} 
      style={{justifyContent: "flex-end"}}
    >
      <button
        className={classNames(styles.button, {[styles.selectable]: data.length === selected.length})}
        onClick={data.length === selected.length ? () => {

          let dataFiltered = selected.filter(d => d.selected === 1);
          const n = dataFiltered.length;

          if (n < ballotSize) {
            const diff = ballotSize - n;
            const ids = dataFiltered.map(d => d.id);
            const dataTmp = selectedAll.filter(d => d.selected === 1 && !ids.includes(d.id));

            dataFiltered = dataFiltered.concat(sample(dataTmp, diff));
            dataFiltered = shuffle(dataFiltered);
          }

          // const openPanel = dataFiltered.filter(d => d.selected === 1).length > 1 && n > 0;
          const newState = {
            ...state,
            dataFiltered,
            selected: []
          };
          
          setData(selected, newState);
        } : undefined}>
        {t("text.next")}
      </button>
    </div>
  
  </main>;
}