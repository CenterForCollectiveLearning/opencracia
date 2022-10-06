import React, {useState} from "react";

import styles from "./Footer.module.scss";

function MiniLogo(props) {
  const {href, src} = props;
  return <div className="mini-logo">
    <a href={href} target="_blank" rel="noreferrer">
      <img src={src} alt="" />
    </a>
  </div>;
}

export default function Footer(props) {
  return <footer className={styles.footer}>

  </footer>;
}