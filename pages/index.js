import React, {useEffect, useState} from "react";
import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import {useSelector} from "react-redux";

import Navbar from "../components/Navbar";

import {MdLiveHelp} from "react-icons/md";

import styles from "../styles/Home.module.scss";
import Loading from "../components/Loading";
import {chunks, combinations, random, shuffle} from "../helpers/utils";
import ConsentForm from "../components/ConsentForm";
import PopupResults from "../components/PopupResults";
import {ProgressBar} from "@blueprintjs/core";
import numeral from "numeral";
import Link from "next/link";

import Pairwise from "../modules/Pairwise";
import Rank from "../modules/Rank";
import Approval from "../modules/Approval";

import store, {properties, users} from "../store/store";
import Fallback from "../modules/Fallback";

export default function Proposal(props) {
  const [state, setState] = useState({
    baseCount: 0,
    consentFormType: 0,
    count: 0,
    dataFiltered: [],
    dataRanked: [],
    dataSelectedAll: [],
    dragdrop: false,
    isOpen: false,
    isOpenConsentForm: true,
    isOpenPopupResults: false,
    loading: true,
    pos: 0,
    updated: 0
  });

  const {
    baseCount,
    consentFormType,
    count,
    dataLevel,
    dataFiltered,
    dataRanked,
    dataSelected,
    dataSelectedAll,
    dragdrop,
    isOpenConsentForm,
    isOpenPopupResults,
    loading,
    pos
  } = state;
  const {lang, t} = useTranslation("translation");
  
  const {
    ballotSize,
    data,
    dataChunks,
    module,
    subBallotPos
  } = useSelector(state => state.properties);

  const {token} = useSelector(state => state.users);

  useEffect(async() => {
    const data = props.data;
    store.dispatch(properties.actions.updateData(data));

    let dataChunks = data.slice();
    if (module === "pairwise") 
      dataChunks = shuffle(combinations(data, 2));

    else
      dataChunks = chunks(data, ballotSize);
    
    store.dispatch(properties.actions.updateDataChunks(dataChunks));

    const dataKey = data.reduce((obj, d) => {
      obj[d.id] = d[lang];
      return obj;
    }, {});
    
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        user_id: token
      })
    };
    const validate = await fetch("/api/validate", requestOptions)
      .then(resp => resp.json());

    
    const participation = await fetch("/api/getParticipation", requestOptions)
      .then(resp => resp.json());

    const dataSelectedAll = [];
    for (const s of participation[0]) 
      dataSelectedAll.push({selected: 0, id: s.toString(), name: dataKey[s]});

    for (const s of participation[1]) 
      dataSelectedAll.push({selected: 1, id: s.toString(), name: dataKey[s]});
    
    for (const s of participation["-1"]) 
      dataSelectedAll.push({selected: -1, id: s.toString(), name: dataKey[s]});

    let tmpData = data.filter(d => !participation[0].includes(d.id)
      && !participation[1].includes(d.id)
      && !participation["-1"].includes(d.id));

    tmpData = shuffle(tmpData);
    // data = shuffle(data);

    const n = tmpData.length;
    const {panelA, panelB} = participation;

    setState({
      ...state,
      baseCount: parseInt(panelA / ballotSize) + panelB,
      dataSelectedAll,
      dataFiltered: shuffle(dataSelectedAll).slice(0, ballotSize),
      isOpenConsentForm: false, // validate.length === 0,
      loading: false
    });
  }, []);

  const Nav = <Navbar hmTitle={"MonProgramme"} />;
  const helpButton = <button className={styles.help} 
    onClick={() => {
      setState({
        ...state,
        isOpenConsentForm: true,
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
  const expectedCount = data.length / ballotSize;
  const num = baseCount + count;
  const den = (expectedCount === baseCount ? 1 : 2) * (data.length / ballotSize);
  const progress = num / den;

  const popupResults = <PopupResults
    callback={isOpenPopupResults => setState({...state, isOpenPopupResults})}
    isOpen={isOpenPopupResults}
  />;

  const progressBar = progress < 1 ? <div className={classNames(styles.comparison, styles.progressbar)}>
    <div className={styles.title}>
      <h3>{t("text.my-progress")} ({numeral(progress < 1 ? progress : 1).format("0,0%")})</h3>
      {progress >= 0.1 && <Link
        onClick={() => setState({...state, isOpenPopupResults: true})}
        href="/results"
      >
        <a
          className={styles.button}
        >
          {t("results.title")}
        </a>
      </Link>}
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
    callback={isOpenConsentForm => {
      setState({...state, isOpenConsentForm});
    }}
  />;

  if (loading) {
    return <div className={styles.container}>
      {Nav}
      {title()}
      <Loading label={t("messages.loading")} />
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
      {title()}
      {helpButton}
      {frameModule}
    </div>
    {/* {consentForm} */}
  </>;

}

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library

  const resp = await fetch("http://localhost:3000/api/proposals");
  const data = await resp.json();

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {data}
  };
}
