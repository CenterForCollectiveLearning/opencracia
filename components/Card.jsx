import React, {useEffect, useState} from "react";
import classNames from "classnames";

import styles from "./Card.module.scss";

export default function Card(props) {
  const [isClicked, setIsClicked] = useState(false);

  const {callback, flexDirection="row", icon=undefined, item, lang, lite=false, options} = props;
  const title = item[lang] || item.name || item.title || item.en || "";
  const footer = item.footer || item.topic_name || item[`${lang}_category`] || "";
  const multichoice = item[`${lang}_multichoice`] || [];

  useEffect( () => {
    setIsClicked(false);
  }, [props]);

  const cardStyle = {};
  console.log(item);
  const isPhoto = item.photo !== undefined && (item.photo !== "" && lite);

  if (isPhoto)
    cardStyle.backgroundImage = `url(${item.photo})`;



  return <div className={styles.cardwrapper}>
    <div 
      className={classNames(
        styles.card, 
        {[styles.lite]: lite}, 
        {[styles.photo]: isPhoto}
      )}
      key={`${item.id}_card_${Math.random()}`}
      onClick={evt => {
        if (item.multichoice) setIsClicked(true);
        else {
          setIsClicked(false);
          callback(evt, item, options);
        }
      }}
      style={cardStyle}
    >
      <div className={styles["card-body"]} style={{flexDirection}}>
        {icon && <img className={styles.icon} src={icon} alt="" />}
        <span className={styles.label}>{title}</span>
      </div>
    </div>
    <div className={styles.multichoice}>
      {isClicked && multichoice.map((d, i) => 
        <div 
          className={styles.item} 
          key={`${i}_mc_${item.id}`}
          onClick={evt => {
            setIsClicked(false);
            callback(evt, item, options);
          }}
        >
          {d}
        </div>
      )}
    </div>
  </div>;
}
