import React, {useEffect, useState} from "react";
import {marked} from "marked";
import Navbar from "../components/Navbar";
import useTranslation from "next-translate/useTranslation";

import styles from "../styles/Home.module.scss";

export default function About(props) {
  const [data, setData] = useState(undefined);
  const {t, lang} = useTranslation("translation");

  useEffect(() => {
    fetch(`/about/${lang}.md`)
      .then(response => response.text())
      .then(text => {
        setData(marked.parse(text));
      });
  }, []);

  const nav =<Navbar
    // hmTitle={`${t("results.title")} / ${t("website.name")}`}
    selected="about"
  />;

  return <div className={styles.container}>
    {nav}
    <div className={styles.main} dangerouslySetInnerHTML={{__html: data}} />
  </div>;
}