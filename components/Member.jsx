import React from "react";

import styles from "./Member.module.scss";

export default function Member(props) {
  const {name, photo} = props;
  return <div className={styles.member}>
    <div className={styles.photo} style={{backgroundImage: `url(${photo})`}}></div>
    <p className={styles.title}><span className={styles.name}>{name}</span><br/> {props.text}</p>
  </div>;
}