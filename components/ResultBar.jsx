import classNames from "classnames";
import {colorContrast} from "d3plus-color";
import numeral from "numeral";
import React, {useState} from "react";
import {CircularProgressbar} from "react-circular-progressbar";
import useTranslation from "next-translate/useTranslation";

import styles from "./ResultBar.module.scss";

const hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const RGBAtoRGB = (r, g, b, a, r2,g2,b2) => {
  var r3 = Math.round(((1 - a) * r2) + (a * r));
  var g3 = Math.round(((1 - a) * g2) + (a * g));
  var b3 = Math.round(((1 - a) * b2) + (a * b));
  return "rgb("+r3+","+g3+","+b3+")";
};

export default function ResultBar(props) {
  const {backgroundColor, count, name, opacity, rank, summary, universe, value} = props;
  const [isOpen, setIsOpen] = useState(false);
  const {t} = useTranslation("translation");
  
  const rgbColor = hexToRgb(backgroundColor);
  const {r, g, b} = rgbColor;
  const bgColor = RGBAtoRGB(r, g, b, opacity, 255, 255, 255);

  const contrast = colorContrast(bgColor, {dark: "#000000", light: "#FFFFFF"});

  return <div className={styles.barwrapper}>
    <div className={classNames(styles.bar, {[styles["is-open"]]: isOpen && summary})} onClick={() => setIsOpen(!isOpen)}
      style={{border: `1px solid ${bgColor}`, backgroundColor: bgColor, color: contrast}}
    >
      <div className={styles.rank} style={{backgroundColor: bgColor, color: contrast}}>{rank}</div>
      <div className={styles.label}>{name}</div>
      {/* <div className={styles.value}>
        <CircularProgressbar
          text={`${parseInt(value * 100)}%`}
          value={value * 100} />
      </div> */}
    </div>
    {(isOpen && summary) && <div className={styles.summary} style={{backgroundColor: bgColor, color: contrast}}>
      {/* <span>{count} {t("results.votes")}</span> */}
      {/* <span>{`${parseInt(value * 100)}%`}</span> */}
      <ul>
        <li><span>{t("bar.win-rate")}: {`${parseFloat(value).toFixed(2)}`}</span></li>
        {/* <li><span>{t("bar.wins")}: {props.wins}</span></li>
        {universe === 2 && <li><span>{t("bar.ties")}: {props.tie}</span></li>}
        <li><span>{t("bar.losses")}: {props.lost || props.losses}</span></li> */}
      </ul>
    </div>}
  </div>;
}