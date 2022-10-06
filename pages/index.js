import React, {useEffect, useState} from "react";
import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";

import CardAgree from "../components/CardAgree";
import DragDrop from "../components/DragDrop";
import Navbar from "../components/Navbar";

import {MdLiveHelp} from "react-icons/md";

import styles from "../styles/Home.module.scss";
import Loading from "../components/Loading";
import Popup from "../components/Popup";
import {random, shuffle} from "../helpers/utils";
import ConsentForm from "../components/ConsentForm";
import Card from "../components/Card";
import PopupResults from "../components/PopupResults";
import {ProgressBar} from "@blueprintjs/core";
import numeral from "numeral";
import Link from "next/link";
import {usePlausible} from "next-plausible";

const selfReported = {
  4: 5,
  5: 4,
  6: 3
};


const sample = (array, n) => {
  const shuffled = shuffle(array);
  return shuffled.slice(0, n);
};

export default function Proposal() {
  const [state, setState] = useState({
    baseCount: 0,
    chunkpanel: 5,
    chunksize: 1,
    consentFormType: 0,
    count: 0,
    data: [],
    dataFiltered: [],
    dataLevel: [[]],
    dataRanked: [],
    dataSelected: [],
    dataSelectedAll: [],
    dragdrop: false,
    // individualParticipation: [],
    isOpen: false,
    isOpenConsentForm: true,
    isOpenPopupResults: false,
    loading: true,
    pos: 0,
    updated: 0,
    uuid: undefined
  });

  const {
    baseCount,
    chunksize,
    consentFormType,
    count,
    data,
    dataLevel,
    dataFiltered,
    dataRanked,
    dataSelected,
    dataSelectedAll,
    dragdrop,
    // individualParticipation,
    isOpen,
    isOpenConsentForm,
    isOpenPopupResults,
    itemA,
    itemB,
    loading,
    pos,
    updated,
    uuid
  } = state;
  const {lang, t} = useTranslation("translation");
  
  const {executeRecaptcha} = useGoogleReCaptcha();
  const plausible = usePlausible();

  useEffect(async() => {
    let data = await fetch("/api/proposals")
      .then(resp => resp.json());
    const dataKey = data.reduce((obj, d) => {
      obj[d.id] = d[lang];
      return obj;
    }, {});
    
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        user_id: localStorage.getItem("mptoken")
      })
    };
    const validate = await fetch("/api/validate", requestOptions)
      .then(resp => resp.json());

    // const participationVec = await fetch("/api/getIndividualParticipation", requestOptions)
    //   .then(resp => resp.json());
    
    const participation = await fetch("/api/getParticipation", requestOptions)
      .then(resp => resp.json());
    // console.log(getParticipation);
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
    const chunksize = localStorage.getItem("mpuniverse") * 1;
    // data = shuffle(data);

    const n = tmpData.length;
    const dataChuncked = [];
    const j = tmpData.length;
    
    // if ()
    for (let i = 0; i < j; i += chunksize) {
      const temporary = tmpData.slice(i, i + chunksize);
      dataChuncked.push(temporary);
    }

    const _i = random(0, data.length - 1);
    let _j = random(0, data.length - 1);
    while (_i === _j) 
      _j = random(0, data.length - 1);
    


    const {panelA, panelB} = participation;

    setState({
      ...state,
      baseCount: parseInt(panelA / chunksize) + panelB,
      chunksize,
      data,
      dataLevel: dataChuncked,
      dataSelectedAll,
      dataFiltered: shuffle(dataSelectedAll).slice(0, chunksize),
      // individualParticipation: participatisonVec,
      isOpenConsentForm: validate.length === 0,
      itemA: data[_i],
      itemB: data[_j],
      loading: false,
      uuid: localStorage.getItem("mptoken")
    });
  }, []);

  const setData = async(data, table, newState) => {
    // const n = data.length;

    const _token = await executeRecaptcha("action");

    // After N panels, display self-reported form
    const userId = localStorage.getItem("mptoken");
    if (table === "rank") {
      data.user_id = userId;
      data.token = _token;
      data.universe = chunksize;

      const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      };
      fetch("/api/createRank", requestOptions);
  
      // newState.token = _token;
    }

    else if (table === "agree") {
      const tmp = data.map(d => [userId, d.id * 1, d.selected, chunksize, lang, d.option]);

      const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({data: tmp, token: _token})
      };
      fetch("/api/createAgree", requestOptions);
    }

    if ((baseCount + count + 1) === selfReported[chunksize]) 
      newState.isOpen = true;
    
    window.scrollTo(0, 0);
    setState(newState);
  };

  const setPair = async(idA, idB, selected) => {
    const n = data.length;

    const _token = await executeRecaptcha("action");

    // After N panels, display self-reported form
    const userId = localStorage.getItem("mptoken");
    const request = {
      locale: lang,
      token: _token,
      universe: 2,
      updated: 1,
      user_id: userId
    };

    let rank = `${idA}=${idB}`;
    let tmp = [
      [userId, idA, 1, 2, lang, null],
      [userId, idA, 1, 2, lang, null]
    ];

    data.map(d => [userId, d.id * 1, d.selected, chunksize, lang, d.option]);
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
    fetch("/api/createRank", requestOptions);
  
    const i = random(0, n - 1);
    let j = random(0, n - 1);
    while (i === j) 
      j = random(0, n - 1);
    
    const newState = {...state, count: state.count + 1, itemA: data[i], itemB: data[j], token: _token};

    if ((baseCount + count + 1) === selfReported[chunksize]) 
      newState.isOpen = true;
    
    setState(newState);
  };

  const Nav = <Navbar
    hmTitle={"MonProgramme"}
  />;
  const helpButton = <button className={styles.help} 
    onClick={() => 
    {plausible("index.help");
      setState({
        ...state,
        isOpenConsentForm: true,
        consentFormType: 1,
      });
    }}>
    <MdLiveHelp />
  </button>;

  const title = (label=t("main.title")) => <h1 className={classNames("title", styles.title)}>
    <span>{label}</span>
  </h1>;

  const popupResults = <PopupResults
    callback={isOpenPopupResults => setState({...state, isOpenPopupResults})}
    isOpen={isOpenPopupResults}
  />;

  const expectedCount = data.length / chunksize;

  const num = baseCount + count;
  const den = (expectedCount === baseCount ? 1 : 2) * (data.length / chunksize);

  const progress = num / den;

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

  if (loading) {
    return <div className={styles.container}>
      {Nav}
      {title()}
      <Loading label={t("messages.loading")} />
    </div>;
  }

  if (chunksize === 2) {
    return <>
      <div className={styles.container}>
        {Nav}
        {title()}
        {helpButton}

        <main className={styles.main}>
          {/* <h4>{count}</h4> */}

          <div className={styles.comparison}>
            <Card item={itemA} lang={lang} callback={() => setPair(itemA.id, itemB.id, itemA.id)}/>
            <Card item={itemB} lang={lang} callback={() => setPair(itemA.id, itemB.id, itemB.id)}/>
          </div>
          <div className={styles.comparison}>
            <Card
              lite={true}
              icon="/icons/both.svg"
              item={{name: t("pairwise.both"), id: 0}} callback={() => setPair(itemA.id, itemB.id, 0)}
            />
            <Card
              lite={true}
              icon="/icons/neither.svg"
              item={{name: t("pairwise.neither"), id: 0}} callback={() => setPair(itemA.id, itemB.id, -2)}
            />
            <Card
              lite={true}
              icon="/icons/jump.svg"
              flexDirection="row-reverse"
              item={{name: t("pairwise.jump"), id: 0}} callback={() => setPair(itemA.id, itemB.id, -1)}
            />
          </div>

        </main>
      </div>
      <Popup isOpen={isOpen} callback={d => setState({...state, isOpen: d})} />
      <ConsentForm
        type={consentFormType}
        isOpen={isOpenConsentForm}
        callback={isOpenConsentForm => {
          setState({...state, isOpenConsentForm});
        }}
      />
    </>;
  }

  if (!dragdrop && (dataLevel.length > pos)) {
    return <div className={styles.container}>
      {Nav}
      <div className={styles.comparison}>
        {title()}
      </div>
      {helpButton}
      <main className={styles.main}>
        <div className={styles.comparison}>
          {dataLevel[pos].map((d, i) => <CardAgree
            callback={item => {
              const tmp = dataSelected.filter(d => d.id !== item.id);
              const tmpAll = dataSelectedAll.filter(d => d.id !== item.id);
              setState({
                ...state,
                dataSelected: tmp.concat(item),
                dataSelectedAll: tmpAll.concat(item)
              });
            }}
            item={d}
            key={`card_agree_${d.id}`}
            lang={lang}
          />)}
          
        </div>
        <div className={styles.comparison} style={{justifyContent: "flex-end"}}>
          <button
            className={classNames(styles.button, {[styles.selectable]: dataLevel[pos].length === dataSelected.length})}
            onClick={dataLevel[pos].length === dataSelected.length ? () => {

              let dataFiltered = dataSelected.filter(d => d.selected === 1);
              const n = dataFiltered.length;
              if (n < chunksize) {
                const diff = chunksize - n;
                const ids = dataFiltered.map(d => d.id);
                const dataTmp = dataSelectedAll.filter(d => d.selected === 1 && !ids.includes(d.id));

                dataFiltered = dataFiltered.concat(sample(dataTmp, diff));
                dataFiltered = shuffle(dataFiltered);
              }

              const openPanel = dataFiltered.filter(d => d.selected === 1).length > 1 && n > 0;
              const newState = {
                ...state,
                count: count + 1,
                dataFiltered,
                dataRanked: dataFiltered,
                dragdrop: openPanel,
                updated: 0
              };
              if (!openPanel) {
                newState.pos = pos + 1;
                newState.dataSelected = [];
              }
              setData(dataSelected, "agree", newState);
            } : undefined}>{t("text.next")}</button>
        </div>
        
      </main>

      {progressBar}

      {popupResults}

      <Popup
        isOpen={isOpen}
        callback={isOpen => setState({...state, isOpen})}
      />
      <ConsentForm
        type={consentFormType}
        isOpen={isOpenConsentForm}
        callback={isOpenConsentForm => {
          setState({...state, isOpenConsentForm});
        }}
      />
    </div>;
  }

  else {
    return <div className={styles.container}>
      {Nav}
      {helpButton}
      <div className={styles.comparison}>
        {title(t("main.dragdrop"))}
      </div>
      <main className={styles.main}>
        <div className={styles.comparison}>
          <DragDrop
            key={Math.random()}
            data={dataFiltered}
            callback={dataRanked => {
              setState({
                ...state,
                dataFiltered: dataRanked,
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
                rank,
                updated
              };

              const newState = {
                ...state,
                count: count + 1,
                dataSelected: [],
                dragdrop: false,
                pos: pos + 1,
                updated: 0
              };

              if ((pos + 1) >= dataLevel.length) 
                newState.dataFiltered = shuffle(dataSelectedAll.filter(d => d.selected === 1)).slice(0, chunksize);

              setData(row, "rank", newState);
            }}>{t("text.next")}</button>
          {progress >= 1 && <Link
            href="/results"
          >
            <a className={classNames(styles.button, styles.results)}>
              {t("text.go-to-results")}</a>
          </Link>}
        </div>
      </main>

      {/* {popupResults} */}
      {progressBar}

      <ConsentForm
        type={consentFormType}
        isOpen={isOpenConsentForm}
        callback={isOpenConsentForm => {
          setState({...state, isOpenConsentForm});
        }}
      />

    </div>;
  }

}