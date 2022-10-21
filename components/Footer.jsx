import React from "react";

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
    The Opencracia framework was created by the 
    {" "}<a href="https://centerforcollectivelearning.org">Center for Collective Learning</a> and <a href="https://irit.fr">IRIT</a> under GPL-3 License.
    For technical support, visit the official <a href="https://github.com/CenterForCollectiveLearning/opencracia">GitHub</a> of the project.
  </footer>;
}