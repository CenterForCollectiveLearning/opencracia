import React from "react";

import styles from "./AboutDescription.module.scss";

export default function AboutDescription(props) {

  const {callback, children, data} = props;
  return <div className={styles.description} dangerouslySetInnerHTML={{__html:data}} />;

}