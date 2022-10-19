import React, {useEffect, useState, useRef} from "react";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import ResultBar from "../components/ResultBar";
import CustomButton from "../components/CustomButton";
import ToggleButton from "../components/ToggleButton";
import ShowDemoMap from "../components/ShowDemoMap";
import ShowGenderPlot from "../components/ShowGenderPlot";
import ShowPartiesPlot from "../components/ShowPartiesPlot";
import ShowEducationPlot from "../components/ShowEducationPlot";
import ShowAgePlot from "../components/ShowAgePlot";
import {Toaster, Position, Button, Toast, Intent} from "@blueprintjs/core";
import useTranslation from "next-translate/useTranslation";
import {interpolatePlasma} from "d3-scale-chromatic";
import {shareText} from "../helpers/utils";
import {usePlausible} from "next-plausible";

import styles from "../styles/Results.module.scss";
import {FaShare} from "react-icons/fa";

var numberPeople;
var numberPreferences;

export function copyToClipboard(text) {
  let dummy = document.createElement("textarea");
  // to avoid breaking orgain page when copying more words
  // cant copy when adding below this code
  // dummy.style.display = 'none'
  document.body.appendChild(dummy);
  //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}


const scale = (value, old_min, old_max, new_max, new_min) => ((value - old_min) / (old_max - old_min)) * (new_max - new_min) + new_min;

export function Rank(props) {
  const {t} = useTranslation("translation");
  const [isOpen, setIsOpen] = useState(true);
  const {backgroundColor, data, display = true, summary=true, title, value} = props;
  
  const N_ITEMS = 10;

  const filteredData = isOpen ? data.slice(0, N_ITEMS) : data;

  const label = !isOpen ? "results.toggle-show" : "results.toggle-hide";
  let tmpValue = 1;
  let tmpRank = 1;

  // XXX: number of people
  // YYY: number of preferences .replace("YYY", numberPreferences)
  
  const subtitle = t(title+"-2").replace("XXX", numberPeople);

  return <div className="column">
    <h2 className="is-center">{t(title)}</h2>
    <h3 className="is-center">{subtitle}</h3>
    {filteredData.map((d, i, {length}) => {
      const _value = d[value];
      if (i === 0) tmpValue = _value;

      if (tmpValue !== _value) 
        tmpRank += 1;
      

      tmpValue = _value;
      return <ResultBar
        {...d}
        key={i + 1}
        summary={summary}
        rank={tmpRank}
        backgroundColor={backgroundColor}
        opacity={i < 10 ? scale(1 - (tmpRank - 1) / 10, 0, 1, 1, 0.2) : 0.2}
        count={d.wins ? d.wins + d.tie + d.lost : d.count}
        name={d.name}
        universe={localStorage.getItem("mpuniverse") * 1}
        value={_value}
      />;
    })}
    {(display && data.length > N_ITEMS) && <ToggleButton label={t(label)} onClick={() => setIsOpen(!isOpen)} />}
    
  </div>;
}

export default function Results() {
  const [state, setState] = useState({
    agreements: [], count: 0, data: [], disagreements: [], loading: true, proposals: [], overall: [], mapDemographics:[], genderDemographics:[], partiesDemographics:[], educationDemographics:[], ageDemographics:[]
  });
  const {agreements, count, data, disagreements, loading, proposals, overall} = state;

  const THRESHOLD_COUNT = 10;
  const {lang, t} = useTranslation("translation");

  const refHandlers = useRef();
  const plausible = usePlausible();

  const addToast = (toast, callback) => {
    
    const defaultToast = {
      className: "toast-sucess",
      timeout: 5000,
      intent: Intent.SUCCESS,
      position: Position.BOTTOM
    };

    const toastOutput = Object.assign(defaultToast, toast);
    refHandlers.current.show(toastOutput);
    // .current.create(toastOutput);
  };

  
  
  
  function catchErrorFunction (response){
    const {status} = response;
    if (status === 200) 
      return response.json();
    else {
      addToast({
        message: t("popup.message-error"),
        intent: Intent.DANGER
      }, undefined); 
    }
  }

  useEffect(async () => {
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        user_id: localStorage.getItem("mptoken")
      })
    };
    const proposals = await fetch("/api/proposals").then(resp => resp.json());
    let {data, count} = await fetch("/api/ranking", requestOptions).then(resp => resp.json());
    const overall = await fetch("/results.json").then(resp => resp.json());

    let _ = overall.data;
    _.forEach(d => {
      const item = proposals.find(h => d.id * 1 === h.id * 1) || {};
      d.name = item.name || item[lang] || undefined;
    });
    _ = _.filter(d => d.name !== undefined);

    const agreements = _.slice().filter(d => d.agreement !== null);
    agreements.sort((a, b) => b.agreement - a.agreement);
    agreements.forEach((d, i) => {
      d.backgroundColor = interpolatePlasma(i / agreements.length);
    });

    data.forEach(d => {
      const item = proposals.find(h => d.id * 1 === h.id * 1) || {};
      const tmp = agreements.find(h => d.id * 1 === h.id * 1) || {};
      d.backgroundColor = tmp.backgroundColor || "red";
      d.name = item.name || item[lang] || undefined;
    });
    data = data.filter(d => d.name !== undefined);
    
    // const getPreferences = await fetch("/api/getPreferences").then(resp => resp.json());
    const getUsers = await fetch("/api/getUsers").then(resp => resp.json());

    // numberPreferences = 0; 
    // getPreferences.forEach(d => {
    //   numberPreferences = parseInt(numberPreferences) + (parseInt(d.count) * (parseInt(d.universe) * (parseInt(d.universe) - 1) / 2));
    // });
    numberPeople = getUsers[0].count;
    
    setState({...state, agreements, count, data, loading: false, proposals, overall: overall.data,});
  }, []);

  const title = <h1 className="title">{t("results.title")}</h1>;
  const navBar =<Navbar
    hmTitle={`${t("results.title")} / ${t("website.name")}`}
    selected="results"
  />;

  if (loading) {
    return <>
      {navBar}
      {title}
      <Loading label={t("messages.loading")} />
    </>;
  };

  return <>
    {navBar}
    {title}
    <div className="is-center">
      <button className={styles.share} onClick={() => {
        copyToClipboard(shareText);
        addToast({
          message: t("text.copied"),
          intent: Intent.SUCCESS
        }, undefined);
        plausible("results.button-share");
      }}>
        <FaShare /> {t("text.share")}</button>
    </div>
    <Toaster position={Position.BOTTOM} ref={refHandlers}>
      {/* <Toast
        intent={Intent.DANGER}
        // message="No pudimos almacenar tu respuesta. Inténtalo más tarde."
      /> */}
    </Toaster>
    <div style={{padding: 10}}>
      <div className="columns">
        {count >= THRESHOLD_COUNT
          ? <Rank
            data={data}
            footnote={undefined}
            title={"results.my-ranking-title"}
            value="value"
            backgroundColor="#0055A4"
          />
          : <div className="column">
            <h2 className="is-center">{t("results.my-ranking-title")}</h2>
            <p>{t("results.my-ranking-warning", {count: THRESHOLD_COUNT})}</p>
            <CustomButton href="/" label={t("results.participate")} />
          </div>}

        <Rank
          data={agreements}
          footnote={t("results.agreements-text")}
          title={"results.agreements-title"}
          value="agreement"
          backgroundColor="#EAEAEA"
        />
      </div>
      
    </div>

  </>;
}