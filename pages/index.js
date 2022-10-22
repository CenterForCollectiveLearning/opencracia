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
import numeral from "numeral";
import store, {properties} from "../store/store";
import useTranslation from "next-translate/useTranslation";
import {MdLiveHelp} from "react-icons/md";
import {ProgressBar} from "@blueprintjs/core";
import {chunks, combinations, random, shuffle} from "../helpers/utils";
import {useSelector} from "react-redux";

import styles from "../styles/Home.module.scss";


export default function Proposal(props) {
  const [state, setState] = useState({
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
    consentFormType,
    count,
    dataSelectedAll,
    isOpenConsentForm,
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
    console.log(participation);

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

    setState({
      ...state,
      dataSelectedAll,
      dataFiltered: shuffle(dataSelectedAll).slice(0, ballotSize),
      isOpenConsentForm: false, // validate.length === 0,
      loading: false
    });
  }, []);

  const Nav = <Navbar hmTitle={t("website.name")} />;
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
    {/* {consentForm} */}
    <Footer />
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
