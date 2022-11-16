import React, {useCallback, useEffect, useState} from "react";
import styles from "../styles/Home.module.scss";

import Card from "../components/Card";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import classNames from "classnames";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";

import useTranslation from "next-translate/useTranslation";
import Popup from "../components/Popup";

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function Home() {
  const [state, setState] = useState({
    count: 0,
    data: [],
    isOpen: true,
    itemA: undefined,
    itemB: undefined,
    loading: true,
    token: undefined
  });
  const {count, data, isOpen, itemA, itemB, loading, token} = state;
  const {executeRecaptcha} = useGoogleReCaptcha();


  // You can use useEffect to trigger the verification as soon as the component being loaded
  const {lang, t} = useTranslation("translation");


  useEffect(async() => {
    const data = await fetch("/api/alternatives")
      .then(resp => resp.json());

    const n = data.length;
    const i = random(0, n - 1);
    let j = random(0, n - 1);
    while (i === j) 
      j = random(0, n - 1);

    setState({...state, data, itemA: data[i], itemB: data[j], loading: false});
  }, []);


  const setPair = async(idA, idB, selected) => {
    const n = data.length;

    const _token = await executeRecaptcha("action");

    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        option_a: idA,
        option_b: idB,
        selected: selected,
        token: _token,
        uuid: localStorage.getItem("mptoken")
      })
    };

    if (collectData === true){
      fetch("/api/create", requestOptions);
    }
  
    const i = random(0, n - 1);
    let j = random(0, n - 1);
    while (i === j) 
      j = random(0, n - 1);
    
    const newState = {...state, count: state.count + 1, itemA: data[i], itemB: data[j], token: _token};

    if ((count - 1) === 30) 
      newState.isOpen = true;
    
    setState(newState);
  };

  const title = <h1 className={classNames("title", styles.title)}>
    <span>{t("main.title")}</span>
  </h1>;

  if (loading) {
    return <div className={styles.container}>
      <Navbar />
      {title}
      <Loading label={t("messages.loading")} />
    </div>;
  }

  return (<>
    <div className={styles.container}>
      <Navbar comparison={`${itemA.id}_${itemB.id}`} />
      {title}

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
    <Footer />
  </>
  );
}
