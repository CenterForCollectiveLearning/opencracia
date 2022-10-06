import React, {useCallback, useEffect, useRef, useState} from "react";
import useTranslation from "next-translate/useTranslation";
import ConsentForm from "../components/ConsentForm";
import Navbar from "../components/Navbar";
import {Dialog, Intent, Position, Toaster} from "@blueprintjs/core";
import classNames from "classnames";
import {FaBackspace} from "react-icons/fa";
import {copyToClipboard} from "./results";
import {FiX} from "react-icons/fi";
import styles from "../styles/Daccordle.module.scss";
import Loading from "../components/Loading";
import {candidates} from "../helpers/utils";
import ShowAnswer from "../components/ShowAnswer";
import {usePlausible} from "next-plausible";
import Link from "next/link";

function convertTZ(date, tzString) {
  return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}

const calculateTimeLeft = () => {
  const date = convertTZ(new Date(), "Europe/Paris");
  let year = date.getFullYear();
  const day = date.getDate();
  const hour = date.getHours();
  const month = date.getMonth() + 1;
  const hourTmp = (hour >= 2 && hour < 14) ? 13 : 1;

  let timeLeft = {days: 0, hours: 0, minutes: 0, seconds: 0};
  const difference = +convertTZ(new Date(`${month}/${day + (hourTmp === 1 ? 1 : 0)}/${year} ${hourTmp}:59:59`), "Europe/Paris")
    - +convertTZ(new Date(), "Europe/Paris");

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }
  return timeLeft;
};

function Countdown(props) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });
  
  return <span className={styles.label}>
    {`${timeLeft.hours}:${timeLeft.minutes.toString().padStart(2, "0")}:${timeLeft.seconds.toString().padStart(2, "0")}`}
  </span>;
}

export default function Daccordle(props) {
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

  const [dayKey, setDayKey] = useState(undefined);
  const [level, setLevel] = useState(0);
  const [daccordle, setDaccordle] = useState({});
  const [isOpenConsentForm, setIsOpenConsentForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState(undefined);
  const [gameId, setGameId] = useState(undefined);
  const [answer, setAnswer] = useState([]);
  const {lang, t} = useTranslation("translation");
  const [isOpen, setIsOpen] = useState(false);
  const [solved, setSolved] = useState(false);
  const [panel, setPanel] = useState([
    [undefined,undefined,undefined,undefined,undefined],
    [undefined,undefined,undefined,undefined,undefined],
    [undefined,undefined,undefined,undefined,undefined],
    [undefined,undefined,undefined,undefined,undefined]
  ]);
  const [numberCandidates, setNumberCandidates] = useState(0);
  const [statistics, setStatistics] = useState([]);
  const [checkSources, setCheckSources] = useState({});
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const plausible = usePlausible();

  useEffect(async () => {
    const data = await fetch("/api/proposals")
      .then(resp => resp.json());
    
    const date = convertTZ(new Date(), "Europe/Paris");
    const year = date.getFullYear();
    const day = date.getDate();
    const hour = date.getHours();
    const month = date.getMonth() + 1;
    const hourTmp = (hour >= 2 && hour < 14) ? 1 : 2;
    const dayKey = `${year}_${month}_${day}_${hourTmp}`;

    const requestOptionsGame = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        gameKey: dayKey
      })
    };
    const getGame = await fetch("/api/getGames", requestOptionsGame).then(resp => resp.json());
    // data.token = await executeRecaptcha("action");

    const gameId = setGameId(parseInt(getGame[0].index));
    const id = parseInt(getGame[0].proposal_id);
    const ids = getGame[0].candidate_ids.replace("{","").replace("}","").split(";").map(Number);
    const source_links = getGame[0].source_link.replace("{","").replace("}","").split(";");
    const source_texts = getGame[0].source_text.replace("{","").replace("}","").split(";");
    setNumberCandidates(ids.length);
    var checkSources_ = [];
    ids.forEach((d, i) => {
      checkSources_.push({id: d, proposal: source_texts[i], sourceLink: source_links[i]});
    });
    setCheckSources(checkSources_);

    var gameStructure = [];
    for(var i=0; i<4; i++) {
      gameStructure[i] = [];
      for(var j=0; j<ids.length; j++) 
        gameStructure[i][j] = undefined;
    }

    setPanel(gameStructure);

    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        user_id: localStorage.getItem("mptoken")
      })
    };
    
    const validate = await fetch("/api/validate", requestOptions)
      .then(resp => resp.json());

    const result = candidates.filter(d => ids.includes(d.id * 1)).map(d => d.name);
    setProposal(data.find(d => d.id * 1 === id));
    setAnswer(result);
    setLoading(false);
    setIsOpenConsentForm(validate.length === 0);

    const key = localStorage.getItem("daccordle");
    // const dayKey = `${year}_${month}_${day}_${hourTmp}`;
    const defaultKey = {[dayKey]: gameStructure};
  
    if (!key) {
      localStorage.setItem("daccordle", JSON.stringify(defaultKey));
      setDaccordle(defaultKey);
    }
    else {
      let tmp = JSON.parse(key);
      if (!tmp[dayKey]) 
        tmp = Object.assign({}, tmp, {[dayKey]: gameStructure});

      setDaccordle(tmp);
      const newPanel = tmp[dayKey].map(itm =>
        itm.map(sitm => {
          if (!sitm)
            return undefined;
          else {
            const candidate = candidates.find(h => h.id === sitm * 1);
            candidate.selected = ids.includes(sitm * 1) ? 1 : 0;
            return candidate;
          }
        }));
      const lastLevel = newPanel.reduce((value, d, i) => {
        const isUndefined = d.some(h => h === undefined);
        if (!isUndefined) value += 1;
        return value;
      }, 0);
      setLevel(lastLevel);
      setPanel(newPanel);

      if (lastLevel > 0) {
        const sum = newPanel[lastLevel - 1].reduce((sum, d) => sum + d?.selected, 0);
        setSolved(sum === newPanel[lastLevel - 1].length);
      } else {
        // 
        // console.log(tmp);
        // tmp = Object.assign({}, tmp, {[dayKey]: newPanel});
        localStorage.setItem("daccordle", JSON.stringify(tmp));
      }
    }
      
    
    setDayKey(dayKey);

  }, []);

  const onEnterClick = panel => {
    const tmp = panel.slice();
    const test = tmp[level].some(d => d === undefined);
    if (!test) {
      plausible("game-row-enter");
      const tmp_selected = selectedCandidates;
      tmp[level].forEach(d => {
        d.selected = answer.includes(d.name) ? 1 : 0;
        if (d.selected === 0)
          tmp_selected.push(d.name);
      });
      const sum = tmp[level].reduce((sum, d) => sum + d.selected, 0);
      setSolved(sum === tmp[level].length);
      setSelectedCandidates(tmp_selected);

      proposal.trials = [];
      tmp[level].forEach(d => proposal.trials.push(parseInt(d.id)));
      proposal.solved = (sum === tmp[level].length) ? 1 : 0;
      proposal.user_id = localStorage.getItem("mptoken");
      proposal.game_id = gameId;
      proposal.level = level;
              
      const stats = [];
      statistics.forEach(d => stats.push(d));
      // const perc = sum / answer.length;
      stats.push(parseInt(sum));
              
      setStatistics(stats);
      const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(proposal)
      };
      fetch("/api/createGameParticipant", requestOptions);

      const tmpOpen = ((level + 1) >= panel.length) || sum === tmp[level].length;
      setIsOpen(tmpOpen);
      // if (tmpOpen) {
      // Includes some data
      const newPanel = panel.map(itm => itm.map(sitm => sitm === undefined ? null : sitm.id));
      const newDaccordle = Object.assign({}, daccordle, {[dayKey]: newPanel});
      localStorage.setItem("daccordle", JSON.stringify(newDaccordle));
      // }
      setPanel(tmp);
      setLevel(level + 1);
    }
  };

  const handleUserKeyPress = useCallback(event => {
    if (event.keyCode === 13) 
      onEnterClick(panel);
    
  }, [panel]);

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  const title = <h1 className={styles.title}>{t("daccordle.title")}</h1>;
  const nav = <Navbar
    hmTitle={"D'accordle / MonProgramme"}
    hmProps={{
      og_description: "Devinez quel.le.s candidat.e.s soutiennent cette proposition. Vous avez 4 essais !",
      og_image: "https://monprogramme2022.org/opengraph/daccordle.jpg",
      og_url: "https://monprogramme2022.org/daccordle/",
      og_title: "D'accordle / MonProgramme 2022"
    }}
    logo="/logos/daccordle.svg"
    selected="daccordle" />;

  if (loading) {
    return <>
      {nav}
      <div className={classNames("container", styles.daccordle)} />
      {title}
      <div className={classNames("container", styles.daccordle)} />
      <Loading label={t("messages.loading")} />
    </>;
  };

  let string = "";
  for (const row of panel) {
    for (const cell of row) 
      string += cell?.selected ? "🟩" : "⬜";
    string += "\n";
  }
  // string += `${level}/${panel.length}\n`;
  // string += "https://monprogramme2022.org";
  copyToClipboard(string);
  
  candidates.sort((a, b) => a.shortname.localeCompare(b.shortname));

  return <>
    {nav}
    <div className={classNames("container", styles.daccordle, {[styles.buttons]: (panel.length === level || solved)})}>
      {(panel.length === level || solved) && <Link href="/">
        <a className={classNames(styles.button, styles.participate)}>{t("daccordle.participate")}</a>
      </Link>}
      {(panel.length === level || solved) &&
        <button onClick={() => setIsOpen(true)} className={styles.button}>
          {t("daccordle.show-results")}
        </button>}
    </div>
    {title}
    <div className={classNames("container", styles.daccordle)}>
      <div className={styles.gamewrapper}>
        <div className={styles.card}>{proposal[lang]}</div>
        <div className={classNames(styles.items, 
          styles[`is-${numberCandidates}`])}>
          {panel.map((d, i) => <div className={styles.level} key={`level_${i}`}>
            {d.map(h => {
              if (h) {
                return <div className={
                  classNames(
                    styles.item,
                    {[styles.selected]: h.selected},
                    {[styles.noselected]: level > i && !h.selected}
                  )}
                >
                  <div className={
                    classNames(
                      styles.candidate,
                    )}
                  style={{backgroundImage: `url(${h.photo})`}}
                  />
                </div>;
              }
              else 
                return <div className={styles.item} />;
            })}
          </div>)}
        </div>

      </div>
      <div className={styles.selectwrapper}>
        {candidates.map((h, i) => <div className={classNames(
          styles.selectpanel)} key={`candidate_${i}`}>
          <div
            onClick={() => {
              const alreadyThere = panel[level].some(d => d?.id === h.id);
              if (!alreadyThere && !solved) {
                const index = panel[level].findIndex(d => d === undefined);
                const tmp = panel.slice();
                tmp[level][index] = {name: h.name, id: h.id, photo: h.photo};
                setPanel(tmp);
              }
            // setSelected([]);
            }}
            style={{backgroundImage: `url(${h.photo})`}}
            className={classNames(
              styles.select,
              {[styles.cselected]: selectedCandidates.includes(h.name) ? 1 : 0},
              {[styles.nocselected]: selectedCandidates.includes(h.name) ? 0 : 1})}></div>
          <span className={styles.name}>{h.shortname}</span>
        </div>)}
      </div>
      <div className={styles.buttons}>
        <button
          className={classNames(styles.button, styles.backspace)}
          onClick={() => {
            if (level < panel.length) {
              const tmp = panel.slice();
              let index = tmp[level].findIndex(d => d === undefined);
              if (index > 0)
                tmp[level][index - 1] = undefined;
              else if (index === -1) 
                tmp[level][answer.length - 1] = undefined;
              setPanel(tmp);
            }
          }}
        >
          <FaBackspace />
        </button>
        <button
          className={styles.button}
          onClick={() => onEnterClick(panel)}
        >
          {t("daccordle.enter")}
        </button>
      </div>
      {/* {(panel.length === level || solved) && <ShowAnswer
        ids={checkSources}
      />} */}
    </div>

    <ConsentForm
      isOpen={isOpenConsentForm}
      gettingStarted={t("daccordle.getting-started")}
      callback={s => setIsOpenConsentForm(s)}
    />

    <Dialog
      className={styles.dialog}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div>
        <div
          className={classNames("is-center", styles.results)}
          style={{whiteSpace: "pre-line"}}
        >
          {string}
        </div>
        <a
          className={styles.close}
          onClick={() => setIsOpen(false)}>
          <FiX />
        </a>
        <div>
          {statistics.map((d, i) => 
            // const x = d.toFixed(1);
            // console.log("statistics",x);
            // TODO, participation in the game
            <div key={`popup_stats_${i}`}>{i+1}. {d} {"/"} {answer.length}</div>
          )}
        </div>
        <div className={styles.share}>
          <div className={styles.countdown}>
            <h3 className={styles.title}>{t("daccordle.next-proposal")}</h3>
            <Countdown />
          </div>
          <div>
            <button
              className={styles.button}
              onClick={() => {
                let string = "";
                for (const row of panel) {
                  for (const cell of row) 
                    string += cell?.selected ? "🟩" : "⬜";
                  string += "\n";
                }
                string += `D'accordle ${solved ? level : "X"}/${panel.length}\n`;
                string += "https://monprogramme2022.org/daccordle";
                copyToClipboard(string);
                addToast({
                  message: t("text.copied"),
                  intent: Intent.SUCCESS
                }, undefined);
                plausible("game-see-results");
              }}
            >
              {t("daccordle.copy")}
            </button>
          </div>
        </div>
        <div>
          <Link href="/">
            <a className={classNames(styles.button, styles.participate)} onClick={plausible("daccordle.participate")}>{t("daccordle.participate")}</a>
          </Link>
        </div>
        <div>
          <ShowAnswer
            open={true}
            ids={checkSources}
          />
        </div>
      </div>
    </Dialog>

    <Toaster position={Position.BOTTOM} ref={refHandlers}>
      {/* <Toast
        intent={Intent.DANGER}
        // message="No pudimos almacenar tu respuesta. Inténtalo más tarde."
      /> */}
    </Toaster>
  </>;
}