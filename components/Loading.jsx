import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";

import styles from "./Loading.module.scss";
import classNames from "classnames";

export default function Loading(props) {
  const {label} = props;

  return <div className={styles.loading}>
    <FontAwesomeIcon className={styles.icon} icon={faCircleNotch} spin={true} />
    <span className={classNames(styles.label, styles.text)}>{label}</span>
  </div>;
}
