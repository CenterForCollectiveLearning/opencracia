import React, {useState} from "react";
import DragDrop from "../components/DragDrop";
import classNames from "classnames";
import store, {properties, users} from "../store/store";
import useTranslation from "next-translate/useTranslation";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {useSelector} from "react-redux";

import styles from "./Rank.module.scss";

export default function Rank(props) {
  const {data, isFallback=false} = props; // dataFiltered
  const [state, setState] = useState({
    dataRanked: data,
    updated: 0
  });
  const {dataRanked, updated} = state;
  const {lang, t} = useTranslation("translation");
  const {token} = useSelector(state => state.users);
  const {ballotSize, subBallotPos, collectData} = useSelector(state => state.properties);
  const {executeRecaptcha} = useGoogleReCaptcha();

  const setData = async(data) => {
    const _token = await executeRecaptcha("action");

    // After N panels, display self-reported form
    const userId = token;

    data.user_id = userId;
    data.token = _token;
    data.universe = ballotSize;
    data.updated = updated;

    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    };
    if (collectData === true){
      fetch("/api/createRank", requestOptions);
    }

    window.scrollTo(0, 0);
    if (isFallback)
      props.callback();
    store.dispatch(properties.actions.updateSubBallotPos(subBallotPos + 1));

    setState({
      ...state,
      updated: 0
    });
  };

  return <main className={styles.main}>
    <div className={styles.comparison}>
      <DragDrop
        key={Math.random()}
        data={updated ? dataRanked : data}
        callback={dataRanked => {
          setState({
            ...state,
            dataRanked,
            updated: 1
          });
        }}
      />
    </div>
    <div className={styles.comparison} style={{justifyContent: "flex-end"}}>
      <button
        className={classNames(styles.button, styles.selectable)}
        onClick={() => {
          const rank = dataRanked.map(d => d.id).join(">");
          const row = {
            locale: lang,
            rank
          };

          const newState = {
            ...state,
            updated: 0
          };

          // if ((pos + 1) >= dataLevel.length) 
          //   newState.dataFiltered = shuffle(dataSelectedAll.filter(d => d.selected === 1)).slice(0, ballotSize);

          setData(row);
        }}>{t("text.next")}</button>
    </div>
  </main>;
}