import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";
import classNames from "classnames";

import styles from "./Navbar.module.scss";
import numeral from "numeral";
import Loading from "./Loading";

import config from "../platform.config";

import {Drawer, Position} from "@blueprintjs/core";

import useTranslation from "next-translate/useTranslation";
import CustomHelmet from "./CustomHelmet";
import {FaAlignJustify, FaBars} from "react-icons/fa";
import {usePlausible} from "next-plausible";


export default function Navbar(props) {
  const {callback=undefined, comparison = undefined, hmProps = {}, hmTitle = config.title, logo = "/logos/monprogramme.svg", selected = undefined} = props;
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(undefined);

  const {lang, t} = useTranslation("translation");
  const plausible = usePlausible();
  const mounted = useRef();

  const getSummary = async () => {
    // const data = await fetch("/api/summary")
    //   .then(resp => resp.json());
    // setCount(data.count * 1);
  };
  useEffect(async () => {
    if (!mounted.current) {
      getSummary();
      mounted.current = true;
    }
    else {
      // do componentDidUpdate logic
      getSummary();
    }
  });

  const brand = <div className={styles.brand}>
    <Link href="/">
      <a><span className={styles.label}>
        {/* {config.title} */}
        <img className={styles.logo} src={logo} alt="" />
      </span></a>
    </Link>
  </div>;

  const redirectUrl = (translate) => {
    if (translate !== "fr")
      return selected ? "/"+translate+`/${selected}` : "/"+translate+"/";
    return selected ? `/${selected}` : "/";
  };

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
        <Link href="/">
          <a className={classNames(styles.item, {[styles.selected]: selected === "participate"})} onClick={() => plausible("menu.participate")}>
            <li className={styles.label}>{t("results.participate")}</li>
          </a></Link>
        <Link href="/about">
          <a className={classNames(styles.item, {[styles.selected]: selected === "about"})} onClick={() => plausible("menu.about")}>
            <li className={styles.label}>{t("menu.about")}</li>
          </a></Link>
        <Link href="/proposals">
          <a className={classNames(styles.item, {[styles.selected]: selected === "proposals"})} onClick={() => plausible("menu.proposals")}>
            <li className={styles.label}>{t("menu.proposals")}</li>
          </a></Link>
        <Link href="/results">
          <a className={classNames(styles.item, {[styles.selected]: selected === "results"})} onClick={() => plausible("menu.results")}>
            <li className={styles.label}>{t("menu.results")}</li>
          </a></Link>
        <Link href="/daccordle">
          <a className={classNames(styles.item, {[styles.selected]: selected === "daccordle"})} onClick={() => plausible("menu.daccordle")}>
            <li className={styles.label}>D&apos;accordle</li>
          </a></Link>
      </ul>
    </Drawer>
    <nav className={styles.navbar}>
      
      <div className={styles.grid}>
        <div className={styles["drawer-button"]} onClick={() => setIsOpen(!isOpen)}>
          <FaBars />
        </div>
        {brand}
        {/* <div>
          {count ? <span className={styles.stat}>{numeral(count).format("0,0")} {t("menu.clicks")}</span> : <Loading />}
        </div> */}
      </div>
      {/* <div className={styles.flag}>
        <img className={styles.img} src="/custom/flag.svg" alt="" />
      </div> */}
      <div className={classNames(styles.grid, styles.desktop)}>
        <ul className={styles["navbar-items"]}>
          <Link href="/">
            <a className={classNames({[styles.selected]: selected === "participate"})} onClick={() => plausible("menu.participate")}>
              <li>{t("results.participate")}</li>
            </a></Link>
          <Link href="/about">
            <a className={classNames({[styles.selected]: selected === "about"})} onClick={() => plausible("menu.about")}>
              <li>{t("menu.about")}</li>
            </a></Link>
          <Link href="/proposals">
            <a className={classNames({[styles.selected]: selected === "proposals"})} onClick={() => plausible("menu.proposals")}> 
              <li>{t("menu.proposals")}</li>
            </a></Link>
          <Link href="/results">
            <a className={classNames({[styles.selected]: selected === "results"})} onClick={() => plausible("menu.results")}>
              <li>{t("menu.results")}</li>
            </a></Link>
          <Link href="/daccordle">
            <a className={classNames({[styles.selected]: selected === "daccordle"})} onClick={() => plausible("menu.daccordle")}>
              <li>D&apos;accordle</li>
            </a></Link>
        </ul>
      </div>
      <div className={styles.langoptions}>
        {/* <Link href={redirectUrl} locale={"fr"} key={"fr"}> */}
        <a href={redirectUrl("fr")} className={classNames(styles.lang, {[styles.selected]: lang === "fr"})} onClick={() => plausible("navbar.fr")}><span>FR</span></a>
        {/* </Link> */}
          |
        {/* <Link href={redirectUrl} locale={"en"} key={"en"}> */}
        <a href={redirectUrl("en")} className={classNames(styles.lang, {[styles.selected]: lang === "en"})} onClick={() => plausible("navbar.en")}><span>EN</span></a>
        {/* </Link> */}
          |
        {/* <Link href={redirectUrl} locale={"es"} key={"es"}> */}
        <a href={redirectUrl("es")} className={classNames(styles.lang, {[styles.selected]: lang === "es"})} onClick={() => plausible("navbar.es")}><span>ES</span></a>
        {/* </Link> */}
      </div>
    </nav>
  </React.Fragment>;
}