import React from "react";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {useSelector} from "react-redux";
import {useState} from "react";
import {random, shuffle} from "../helpers/utils";

import Card from "../components/Card";
import useTranslation from "next-translate/useTranslation";
import styles from "./Pairwise.module.scss";

import store, {properties, users} from "../store/store";

export default function Pairwise(props) {
  const [state, setState] = useState({});
  const {data, subBallotPos, collectData} = useSelector(state => state.properties);
  const {token} = useSelector(state => state.users);
  const {executeRecaptcha} = useGoogleReCaptcha();
  const {itemA, itemB, lang} = props;
  const {t} = useTranslation("translation");

  const setPair = async (idA, idB, selected) => {
    const n = data.length;

    const _token = await executeRecaptcha("action");

    // After N panels, display self-reported form
    const userId = token;
    const request = {
      locale: lang,
      token: _token,
      universe: 2,
      updated: 1,
      user_id: userId
    };

    let rank = `${idA}=${idB}`;

    data.map(d => [userId, d.id * 1, d.selected, 2, lang, d.option]);
    if (selected === -1) {

    }
    else if (selected === 0) {

    }
    else
      rank = idA === selected ? `${idA}>${idB}` : `${idB}>${idA}`;

    request.rank = rank;
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(request)
    };
    if (collectData === true){
      fetch("/api/createRank", requestOptions);
    }
    store.dispatch(properties.actions.updateSubBallotPos(subBallotPos + 1));

    const newState = {
      ...state,
      token: _token
    };

    // if ((baseCount + count + 1) === selfReported[chunksize])
    //   newState.isOpen = true;

    setState(newState);
  };

  return <main className={styles.main}>
    <div className={styles.comparison}>
      <Card 
        item={itemA}
        lang={lang}
        callback={() => setPair(itemA.id, itemB.id, itemA.id)}
      />
      <Card 
        item={itemB}
        lang={lang}
        callback={() => setPair(itemA.id, itemB.id, itemB.id)}
      />
    </div>
    <div className={styles.comparison}>
      <Card
        lite={true}
        icon="/icons/both.svg"
        item={{name: t("pairwise.both"), id: 0}}
        callback={() => setPair(itemA.id, itemB.id, 0)}
      />
      {/* <Card
        lite={true}
        icon="/icons/neither.svg"
        item={{name: t("pairwise.neither"), id: 0}}
        callback={() => setPair(itemA.id, itemB.id, -2)}
      /> */}
      <Card
        lite={true}
        icon="/icons/jump.svg"
        flexDirection="row-reverse"
        item={{name: t("pairwise.jump"), id: 0}}
        callback={() => setPair(itemA.id, itemB.id, -1)}
      />
    </div>

  </main>;
}