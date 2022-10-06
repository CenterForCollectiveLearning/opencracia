import React, {useRef, useState} from "react";
import {Button, ButtonGroup, Classes, Dialog, Icon, Intent, MenuItem, Position, Radio, RadioGroup, Slider, Toaster} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";

import classNames from "classnames";
import styles from "./Popup.module.scss";
import useTranslation from "next-translate/useTranslation";

import postalCodes from "../public/custom/department.json";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";

const range = (start, end) => Array(end - start + 1).fill().map((_, idx) => start + idx);
const filterItem = (query, item) => item.toString().toLowerCase().indexOf(query.toLowerCase()) >= 0;

function Question(props) {
  const {customClasses, children, title} = props;
  return <div className={classNames(customClasses, styles["question-wrapper"])}>
    <h6 className={styles.title}>{title}</h6>
    {children}
  </div>;
}

function CustomRadioGroup(props) {
  const {data, defaultItem, identifier, setState} = props;
  return <RadioGroup
    inline={true}
    onChange={e => setState(e.target.value)}
    selectedValue={defaultItem * 1}
  >
    {data.map(d => <Radio
      key={`${identifier}_${d.id}`}
      label={d.name}
      value={d.id}
    />)}
  </RadioGroup>;
}

function CustomSelect(props) {
  const {t} = useTranslation("translation");
  const {data, defaultItem, setState} = props;

  return <Select
    className={styles["popup-select"]}
    items={data}
    filterable={false}
    inputProps={{placeholder: t("popup.filter")}}
    itemPredicate={filterItem}
    itemRenderer={(d, active) => <MenuItem 
      active={defaultItem?.id === d.id}
      key={`${d.name}`}
      onClick={() => setState(d)}
      text={d.name}
    />}
    noResults={<MenuItem text={t("popup.no-results")} />}
  >
    <Button 
      className={styles["select-button"]}
      rightIcon="chevron-down" 
      text={defaultItem?.name || t("popup.select")}
    />
  </Select>;
}

export default function Popup(props) {
  const {isOpen, token, userId, callback} = props;
  const [age, setAge] = useState(undefined);
  const [education, setEducation] = useState(undefined);
  const [location, setLocation] = useState(undefined);
  const [politics, setPolitics] = useState(undefined);
  const [postalCode, setPostalCode] = useState(undefined);
  const [postalCodeQuery, setPostalCodeQuery] = useState(undefined);
  const [sex, setSex] = useState(undefined);
  const [zone, setZone] = useState(undefined);

  const {lang, t} = useTranslation("translation");
  const {executeRecaptcha} = useGoogleReCaptcha();
  
  postalCodes.sort((a, b) => a.name.localeCompare(b.name));

  const refHandlers = useRef();

  const addToast = (toast, callback) => {
    // toast.className = "toast-success";
    // toast.timeout = 5000;
    // toast.intent = Intent.SUCCESS;
    
    const defaultToast = {
      className: "toast-sucess",
      timeout: 5000,
      intent: Intent.SUCCESS
    };

    const toastOutput = Object.assign(defaultToast, toast);
    refHandlers.current.show(toastOutput);
    if (callback) 
      callback({isOpen: false});
  };
  
  const educationLevel = [
    {id: 1, name: t("popup.education-pretitle")},
    {id: 2, name: t("popup.education-highschool")},
    {id: 3, name: t("popup.education-undergraduate-i")},
    {id: 4, name: t("popup.education-deug")},
    {id: 5, name: t("popup.education-licence")},
    {id: 6, name: t("popup.education-master")},
    {id: 7, name: t("popup.education-doctorant")},
    {id: 99, name: t("popup.skip")}
  ];

  const options = [t("popup.far-left"), t("popup.left"), t("popup.center"), t("popup.right"), t("popup.far-right")];

  const sexOptions = [
    {id: 1, name: t("popup.sex-female")},
    {id: 2, name: t("popup.sex-male")},
    {id: 98, name: t("popup.other")},
    {id: 99, name: t("popup.skip")}
  ];

  const locationOptions = [
    {id: 1, name: t("popup.location-urban")},
    {id: 2, name: t("popup.location-rural")},
    {id: 99, name: t("popup.skip")}
  ];

  const ageOptions = [
    {id: 1, name: `10-19 ${t("text.years")}`},
    {id: 2, name: `20-29 ${t("text.years")}`},
    {id: 3, name: `30-39 ${t("text.years")}`},
    {id: 4, name: `40-49 ${t("text.years")}`},
    {id: 5, name: `50-59 ${t("text.years")}`},
    {id: 6, name: `60-69 ${t("text.years")}`},
    {id: 7, name: `70+ ${t("text.years")}`},
    {id: 98, name: t("popup.other")},
    {id: 99, name: t("popup.skip")}
  ];

  const tmpLocation = postalCodes
    ? postalCodes.concat([{id: 998, name: t("popup.outside")}, {id: 999, name: t("popup.skip")}])
    : [];
  const postalCodesFiltered = postalCodeQuery ?
    tmpLocation.filter(d => filterItem(postalCodeQuery, d.name) || filterItem(postalCodeQuery, d.id)).slice(0, 200) :
    tmpLocation.slice(0, 200);

  return <Dialog 
    className={styles.popupwrapper}
    isOpen={isOpen}
    onClose={() => callback(false)}
    title={t("popup.title")}
  >
    <div className={classNames(Classes.DIALOG_BODY, styles.popup, styles.popupwrapper)}>
      <p>{t("popup.description")}</p>
      <Question
        title={t("popup.sex-title")}
      >
        <CustomRadioGroup
          data={sexOptions}
          defaultItem={sex}
          identifier="sex"
          setState={setSex}
        />
      </Question>
      <Question
        title={t("popup.age-title")}
        customClasses="age-option"
      >
        <CustomSelect
          data={ageOptions}
          defaultItem={age}
          setState={setAge}
        />
        
      </Question>
      <Question
        title={t("popup.politics-title")}
      >
        <ButtonGroup
          className={styles["button-group"]}
        >
          {options.map((d, i) => <Button 
            className={classNames(styles.button, {[styles.selected]: politics === i + 1})} 
            onClick={() => setPolitics(i + 1)} 
            key={`politics_${i}`}
          >
            {d}
          </Button>)}
        </ButtonGroup>
        <RadioGroup
          inline={true}
          onChange={e => setPolitics(e.target.value)}
          selectedValue={politics * 1}
        >
          <Radio label={t("popup.skip")} value={99} />
        </RadioGroup>
      </Question>

      <Question
        title={t("popup.education-title")}
      >
        <CustomSelect
          data={educationLevel}
          defaultItem={education}
          setState={setEducation}
        />
      </Question>

      <Question
        title={t("popup.department-title")}
      >
        <Select
          className={styles["popup-select"]}
          items={postalCodesFiltered}
          filterable={true}
          inputProps={{placeholder: t("popup.filter")}}
          // itemPredicate={filterItem}
          onQueryChange={e => setPostalCodeQuery(e)}
          itemRenderer={(d, active) => <MenuItem 
            active={postalCode?.id === d.id}
            onClick={() => setPostalCode(d)}
            key={`${d.name}_location`}
            text={[998, 999].includes(d.id) ? d.name : `${d.name} (${d.id})`} 
          />}
          noResults={<MenuItem text={t("popup.no-results")} />}
        >
          <Button 
            className={styles["select-button"]}
            rightIcon="chevron-down" 
            text={postalCode ? `${postalCode.name} (${postalCode.id})` : t("popup.select")}
          />
        </Select>
      </Question>

      <Question
        title={t("popup.location-title")}
      >
        <CustomRadioGroup
          data={locationOptions}
          defaultItem={zone}
          identifier="zone"
          setState={setZone}
        />
      </Question>


      <div className={styles.options}>
        <Button
          className={classNames(styles.button, styles.lite)}
          onClick={() => callback(false)}
        >
          {t("popup.prefer-not-to-answer")}
        </Button>
        <Button className={styles.button} onClick={async() => {
          // location && politics && age && sex && zone
          if (postalCode && politics && education && sex && zone && age) {
            const token = await executeRecaptcha("selfreported");
            const data = {
              age_id: age.id,
              education_id: education.id * 1,
              locale: lang,
              location_id: postalCode.id * 1,
              politics_id: politics,
              sex_id: sex * 1,
              token,
              universe: localStorage.getItem("mpuniverse") * 1,
              user_id: localStorage.getItem("mptoken"),
              zone_id: zone * 1
            };

            const requestOptions = {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify(data)
            };
            const response = await fetch("/api/createParticipant", requestOptions);
            const {status} = response;
            if (status === 200) callback(false);
            else {
              addToast({
                message: t("popup.message-error"),
                intent: Intent.DANGER
              }, undefined);
            }
          }
          else {
            addToast({
              message: t("popup.message-error"),
              intent: Intent.DANGER
            }, undefined);
          }
        
        }}>
          {t("popup.send")}
        </Button>
        
      </div>

      <Toaster position={Position.BOTTOM} ref={refHandlers}>
        {/* <Toast
          intent={Intent.DANGER}
          // message="No pudimos almacenar tu respuesta. Inténtalo más tarde."
        /> */}
      </Toaster>
    </div>
  </Dialog>;
}