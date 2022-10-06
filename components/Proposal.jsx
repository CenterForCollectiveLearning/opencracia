import classNames from "classnames";
import React from "react";

import styles from "./Proposal.module.scss";

export default function Proposal(props) {
  const {name, options} = props;
  return <div className={styles.proposal}>
    <div className={classNames({[styles.label]: options})}>{name}</div>
    <div className={styles.options}>
      {options && options.map((h, i) =>
        <span className={styles.option} key={`proposal_${name}_${i}`}>{h}</span>)}
    </div>
  </div>;
}