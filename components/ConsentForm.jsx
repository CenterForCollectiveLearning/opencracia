import React, {useState} from "react";
import {Button, ButtonGroup, Classes, Dialog, Icon, Intent, MenuItem, Position, Radio, RadioGroup, Slider, Toaster} from "@blueprintjs/core";
import classNames from "classnames";
import Link from "next/link";

import styles from "./ConsentForm.module.scss";
import useTranslation from "next-translate/useTranslation";

export default function ConsentForm(props) {

  const {lang, t} = useTranslation("translation");
  const {callback, gettingStarted = t("popup.lead"), isOpen, type, universe} = props;
  const [count, setCount] = useState(0);

  let panel = gettingStarted;
  if (count === 1) panel = t("popup.consent-form");

  if (type === 1) {
    return <Dialog
      isOpen={isOpen}
      isCloseButtonShown={false}
      title={t("text.help")}
    >
      <div className={classNames(Classes.DIALOG_BODY, styles.consentform)}>
        <div dangerouslySetInnerHTML={{__html: gettingStarted}} />
        <div className={styles.options}>
          <span />
          <button
            className={styles.button}
            onClick={() => callback(false)}
          >{t("text.ok")}</button>
        </div>
      </div>

    </Dialog>;
  }

  return <Dialog
    isOpen={isOpen}
    isCloseButtonShown={false}
    title={""}
  >
    <div className={classNames(Classes.DIALOG_BODY, styles.consentform)}>
      <div dangerouslySetInnerHTML={{__html: panel}} />

      <div className={styles.options}>
        {count > 0 ? <Link className={classNames(styles.button, styles.lite)} href="/about">
          <a>{t("text.no-accept")}</a>
        </Link> : <span />}

        <button
          className={styles.button}
          onClick={() => {
            const newCount = count + 1;
            if (newCount === 2) {
              const data = {
                user_id: localStorage.getItem("mptoken"),
                locale: lang,
                universe: universe
              };
              const requestOptions = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
              };

              fetch("/api/createConsent", requestOptions);
              callback(false);
            }
            setCount(newCount);
            
          }}
        >{count === 0 ? t("text.next") : t("text.accept")}</button>
      </div>
    </div>

  </Dialog>;
}