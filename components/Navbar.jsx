import React, {useEffect, useRef, useState} from "react";
import CustomHelmet from "./CustomHelmet";
import Link from "next/link";
import classNames from "classnames";
import config from "../platform.config";
import configFile from "../opencracia.config.json";
import useTranslation from "next-translate/useTranslation";
import {Drawer, Position} from "@blueprintjs/core";
import {FaAlignJustify, FaBars} from "react-icons/fa";
import {useSelector} from "react-redux";

import styles from "./Navbar.module.scss";

export default function Navbar(props) {

  const {
    callback = undefined, 
    comparison = undefined, 
    hmProps = {}, 
    hmTitle = config.title, 
    logo = "/logos/opencracia.svg", 
    selected = undefined
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const {languages} = useSelector(state => state.languages);
  const {lang, t} = useTranslation("translation");

  const brand = <div className={styles.brand}>
    <Link href="/">
      <a><span className={styles.label}>
        {configFile.title || "Opencracia"}
      </span></a>
    </Link>
  </div>;

  const redirectUrl = (translate) => {
    if (translate !== "en")
      return selected ? "/"+translate+`/${selected}` : "/"+translate+"/";
    return selected ? `/${selected}` : "/";
  };

  const menuItems = <>
    <Link href="/">
      <a className={classNames(styles.item, {[styles.selected]: selected === "participate"})}>
        <li className={styles.label}>{t("results.participate")}</li>
      </a>
    </Link>
    <Link href="/alternatives">
      <a className={classNames(styles.item, {[styles.selected]: selected === "alternatives"})}>
        <li className={styles.label}>{t("menu.alternatives")}</li>
      </a>
    </Link>
    <Link href="/about">
      <a className={classNames(styles.item, {[styles.selected]: selected === "about"})}>
        <li className={styles.label}>{t("menu.about")}</li>
      </a>
    </Link>
    <Link href="/results">
      <a className={classNames(styles.item, {[styles.selected]: selected === "results"})}>
        <li className={styles.label}>{t("menu.results")}</li>
      </a>
    </Link>
  </>;

  return <React.Fragment>
    <CustomHelmet title={hmTitle} {...hmProps} />
    <Drawer
      isOpen={isOpen}
      position={Position.LEFT}
      className={styles.drawer}
      onClose={() => setIsOpen(false)}
    >
      {brand}
      <ul className={styles.items}>
        {menuItems}
      </ul>
    </Drawer>
    <nav className={styles.navbar}>
      <div className={styles.grid}>
        <div className={styles["drawer-button"]} onClick={() => setIsOpen(!isOpen)}>
          <FaBars />
        </div>
        {brand}
      </div>
      <div className={classNames(styles.grid, styles.desktop)}>
        <ul className={styles["navbar-items"]}>
          {menuItems}
        </ul>
      </div>
      <div className={styles.langoptions}>
        {languages.map((l, i) => <div key={`langs_${i}`}>
          <a href={redirectUrl(l)} className={classNames(styles.lang, {[styles.selected]: lang === l})}><span>{l}</span></a>
        </div>)}
      </div>
    </nav>
  </React.Fragment>;
}