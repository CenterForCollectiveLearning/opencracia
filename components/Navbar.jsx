import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";
import classNames from "classnames";

import styles from "./Navbar.module.scss";
import numeral from "numeral";
import Loading from "./Loading";

import config from "../platform.config";
import configFile from "../opencracia.config.json";

import {Drawer, Position} from "@blueprintjs/core";

import useTranslation from "next-translate/useTranslation";
import CustomHelmet from "./CustomHelmet";
import {FaAlignJustify, FaBars} from "react-icons/fa";
import {usePlausible} from "next-plausible";
import {useSelector} from "react-redux";

export default function Navbar(props) {

  const {callback = undefined, comparison = undefined, hmProps = {}, hmTitle = config.title, logo = "/logos/opencracia.svg", selected = undefined} = props;
  const [isOpen, setIsOpen] = useState(false);

  const {languages} = useSelector(state => state.languages);

  const {lang, t} = useTranslation("translation");
  const plausible = usePlausible();

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
      <a className={classNames(styles.item, {[styles.selected]: selected === "participate"})} onClick={() => plausible("menu.participate")}>
        <li className={styles.label}>{t("results.participate")}</li>
      </a>
    </Link>
    <Link href="/proposals">
      <a className={classNames(styles.item, {[styles.selected]: selected === "proposals"})} onClick={() => plausible("menu.proposals")}>
        <li className={styles.label}>{t("menu.proposals")}</li>
      </a>
    </Link>
    <Link href="/results">
      <a className={classNames(styles.item, {[styles.selected]: selected === "results"})} onClick={() => plausible("menu.results")}>
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