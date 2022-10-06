import React from "react";

import styles from "./ToggleButton.module.scss";

export default function ToogleButton(props) {
  const {label, onClick} = props;
  return <button 
    className={styles.toggle} onClick={onClick}>{label}</button>;
}