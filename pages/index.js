import React, {useEffect, useState} from "react";
import Approval from "../modules/Approval";
import ConsentForm from "../components/ConsentForm";
import Fallback from "../modules/Fallback";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import Pairwise from "../modules/Pairwise";
import Rank from "../modules/Rank";
import classNames from "classnames";
import config from "../opencracia.config.json";
import numeral from "numeral";
import store, {properties, users} from "../store/store";
import useTranslation from "next-translate/useTranslation";
import {MdLiveHelp} from "react-icons/md";
import {ProgressBar} from "@blueprintjs/core";
import {chunks, combinations, random, shuffle} from "../helpers/utils";
import {useSelector} from "react-redux";
import {v4 as uuidv4} from "uuid";

import styles from "../styles/Home.module.scss";

export default function Proposal(props) {
  const [state, setState] = useState({
    consentFormType: 0,
    dataFiltered: [],
    dataRanked: [],
    dataSelectedAll: [],
    isOpen: false,
    isOpenConsentForm: false,
    isOpenPopupResults: false,
    loading: true,
    updated: 0
  });

  const {
    consentFormType,
    dataSelectedAll,
    isOpenConsentForm,
    loading
  } = state;
  
  const {lang, t} = useTranslation("translation");
  
  const {
    ballotSize,
    dataChunks,
    module,
    aggregation,
    collectData,
    memory,
    subBallotPos
  } = useSelector(state => state.properties);
  
  useEffect(async() => {
    const tokenName = `${config.domain}-token`;
    const token = localStorage.getItem(tokenName);
    if (!token) 
      localStorage.setItem(tokenName, uuidv4());

    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        user_id: localStorage.getItem(tokenName)
      })
    };

    // Gets previous participation of the same token in the platform
    const prevParticipation = await fetch("/api/getParticipation", requestOptions)
      .then(resp => resp.json());

    const dataSelectedAll = [];
    for (const i of [-1, 0, 1]) {
      for (const s of prevParticipation[0]) 
        dataSelectedAll.push({selected: i, id: s.toString(), module: "approval"});
    }

    let data = props.data;
    if (dataSelectedAll.length && ["approval", "fallback"].includes(module)) {
      const filterIds = dataSelectedAll.map(d => d.id);
      data = data.filter(d => !filterIds.includes(d.id));
    }

    let dataChunks = data.slice();
    if (module === "pairwise") 
      dataChunks = shuffle(combinations(data, 2));
    else
      dataChunks = chunks(shuffle(data), ballotSize);

    const prevRank = prevParticipation.rank.map(d => {
      const keys = d.rank.replace(/>|<|=/g, "_").split("_");
      keys.sort();
      return keys.join("_");
    });

    if (prevRank.length && module === "pairwise") {
      dataChunks = dataChunks.reduce((all, d) => {
        const idA = d[0].id;
        const idB = d[1].id;
        const keys = [idA, idB];
        keys.sort();
        const customId = keys.join("_");

        if (!prevRank.includes(customId)) 
          all.push(d);
        
        return all;
      }, []);
    }

    const dataKey = data.reduce((obj, d) => {
      obj[d.id] = d[lang];
      return obj;
    }, {});

    const consent = await fetch("/api/getConsent", requestOptions)
      .then(resp => resp.json());

    const openConsent = !consent.status;

    let tmpData = data.filter(d => !prevParticipation[0].includes(d.id)
      && !prevParticipation[1].includes(d.id)
      && !prevParticipation["-1"].includes(d.id));

    tmpData = shuffle(tmpData);
    
    // Dispatch states to React Redux
    // console.log("userID 2", token);
    store.dispatch(users.actions.updateToken(token));
    store.dispatch(properties.actions.updateMemory(dataSelectedAll));
    store.dispatch(properties.actions.updateData(data));
    store.dispatch(properties.actions.updateDataChunks(dataChunks));

    setState({
      ...state,
      dataSelectedAll,
      dataFiltered: shuffle(dataSelectedAll).slice(0, ballotSize),
      isOpenConsentForm: openConsent,
      loading: false
    });
  }, []);

  const Nav = <Navbar hmTitle={t("website.name")} />;
  const helpButton = <button className={styles.help} 
    onClick={() => {
      setState({
        ...state,
        isOpenConsentForm: false,
        consentFormType: 1,
      });
    }}>
    <MdLiveHelp />
  </button>;

  // Set title
  const title = (label=t("main.title")) => <h1 className={classNames("title", styles.title)}>
    {label}
  </h1>;

  // Defines Progress Bar percentage
  const progress = subBallotPos / dataChunks.length;

  const progressBar = progress < 1 ? <div className={classNames(styles.comparison, styles.progressbar)}>
    <div className={styles.title}>
      <span>{numeral(progress < 1 ? progress : 1).format("0,0%")}</span>
    </div>
    <ProgressBar
      animate={false}
      className={styles.progress}
      value={progress}
    />
  </div> : <div className={classNames(styles.comparison)}>
    <i className={styles.finished}>{t("text.finished-ranking")}</i>
  </div>;
  

  const consentForm = <ConsentForm
    type={consentFormType}
    isOpen={isOpenConsentForm}
    universe={aggregation}
    collectData={collectData}
    callback={isOpenConsentForm => {
      setState({...state, isOpenConsentForm});
    }}
  />;

  if (loading) {
    return <div className={styles.container}>
      {Nav}
      <Loading 
        isFull={true}
        label={t("messages.loading")} 
      />
    </div>;
  }

  let frameModule = <Pairwise 
    itemA={dataChunks[subBallotPos][0]} 
    itemB={dataChunks[subBallotPos][1]} 
    lang={lang} 
  />;

  if (module === "approval") {
    frameModule = <Approval 
      data={dataChunks[subBallotPos]}
      dataSelectedAll={dataSelectedAll}
    />;
  }

  else if (module === "rank") {
    frameModule = <Rank 
      data={dataChunks[subBallotPos]} // dataFiltered
    />;
  }

  else if (module === "fallback") {
    frameModule = <Fallback
      data={dataChunks[subBallotPos]}
      dataSelectedAll={dataSelectedAll}
    />;
  }

  return <>
    <div className={styles.container}>
      {Nav}
      <main className={styles.main}>
        {title()}
        {helpButton}
        {frameModule}
        {progressBar}
      </main>
    </div>
    {consentForm}
    <Footer />
  </>;

}

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library

  const resp = await fetch("http://localhost:3000/api/alternatives");
  const data = await resp.json();

  // const token = localStorage.getItem("mptoken");
  // if (!token) 
  //   localStorage.setItem("mptoken", uuidv4());
  // store.dispatch(users.actions.updateToken(token));

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {data}
  };
}
