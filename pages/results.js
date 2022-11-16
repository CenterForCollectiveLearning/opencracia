import React, {useEffect, useState, useRef} from "react";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import ResultBar from "../components/ResultBar";
import CustomButton from "../components/CustomButton";
import ToggleButton from "../components/ToggleButton";
import {Toaster, Position, Intent} from "@blueprintjs/core";
import useTranslation from "next-translate/useTranslation";
import {interpolatePlasma} from "d3-scale-chromatic";
import {shareText} from "../helpers/utils";
import config from "../opencracia.config.json";
import styles from "../styles/Results.module.scss";
import {FaShare} from "react-icons/fa";
import {useSelector} from "react-redux";
import Footer from "../components/Footer";

const THRESHOLD_COUNT = 10;

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

  return <div className="column">
    <h2 className="is-center">{t(title)}</h2>
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
        value={_value}
      />;
    })}
    {(display && data.length > N_ITEMS) && <ToggleButton label={t(label)} onClick={() => setIsOpen(!isOpen)} />}
    
  </div>;
}

export default function Results(props) {
  const {data} = props;
  const {token} = useSelector(state => state.users);

  const [state, setState] = useState({
    count: 0, 
    loading: true,
    individualRank: [],
    collectiveRank: []
  });
  const {collectiveRank, individualRank, count, loading} = state;

  const {lang, t} = useTranslation("translation");

  const refHandlers = useRef();

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

  useEffect(async () => {

    const tokenName = `${config.domain}-token`;

    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        user_id: token || localStorage.getItem(tokenName)
      })
    };
    
    const responseIndividual = await fetch("/api/rankingIndividual", requestOptions).then(resp => resp.json());
    const responseCollective = await fetch("/api/rankingCollective", requestOptions).then(resp => resp.json());
    let count = 0;

    let ind = responseIndividual.data;
    let col = responseCollective.data;

    const agreements = col.slice().filter(d => d.agreement !== null);
    agreements.sort((a, b) => b.agreement - a.agreement);
    agreements.forEach((d, i) => {
      d.backgroundColor = interpolatePlasma(i / agreements.length);
    });

    col.forEach(d => {
      const item = data.find(h => d.id.toString() === h.id.toString()) || {};
      const tmp = agreements.find(h => d.id.toString() === h.id.toString()) || {};
      d.backgroundColor = tmp.backgroundColor || "red";
      d.name = item.name || item[lang] || undefined;
    });

    const agrees = ind.slice().filter(d => d.agreement !== null);
    agrees.sort((a, b) => b.agreement - a.agreement);
    agrees.forEach((d, i) => {
      d.backgroundColor = interpolatePlasma(i / agrees.length);
      count = count + d.wins + d.agreed + d.losses + d.disagreed;
    });

    ind.forEach(d => {
      const item = data.find(h => d.id.toString() === h.id.toString()) || {};
      const tmp = agrees.find(h => d.id.toString() === h.id.toString()) || {};
      d.backgroundColor = tmp.backgroundColor || "red";
      d.name = item.name || item[lang] || undefined;
    });

    setState({...state, individualRank: ind, count, loading: false, collectiveRank: col});
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
    {/* <div className="is-center">
      <button className={styles.share} onClick={() => {
        copyToClipboard(shareText);
        addToast({
          message: t("text.copied"),
          intent: Intent.SUCCESS
        }, undefined);
      }}>
        <FaShare /> {t("text.share")}</button>
    </div> */}
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
            data={individualRank}
            footnote={undefined}
            title={"results.my-ranking-title"}
            value="value"
            backgroundColor="#0046bf"
          />
          : <div className="column">
            <h2 className="is-center">{t("results.my-ranking-title")}</h2>
            <p>{t("results.my-ranking-warning", {count: THRESHOLD_COUNT})}</p>
            <CustomButton href="/" label={t("results.participate")} />
          </div>}

        <Rank
          data={collectiveRank}
          footnote={t("results.agreements-text")}
          title={"results.agreements-title"}
          value="value"
          backgroundColor="#EAEAEA"
        />
      </div>
    </div>
    <Footer />

  </>;
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library

  const resp = await fetch("http://localhost:3000/api/alternatives");
  const data = await resp.json();

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {data}
  };
}