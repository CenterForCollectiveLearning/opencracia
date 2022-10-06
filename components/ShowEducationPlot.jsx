import classNames from "classnames";
import numeral from "numeral";
import React, {useEffect, useState} from "react";
import {BarChart} from "d3plus-react";
import useTranslation from "next-translate/useTranslation";
import styles from "./ShowEducationPlot.module.scss";

export default function ShowBarPlot(props) {
  
  const {lang, t} = useTranslation("translation");
  const {data} = props;
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.screen.width);
  }, []);
  
  const educationLevel = {
    1 : t("popup.education-pretitle"),
    2: t("popup.education-highschool"),
    3: t("popup.education-undergraduate-i"),
    4: t("popup.education-deug"),
    5: t("popup.education-licence"),
    6: t("popup.education-master"),
    7: t("popup.education-doctorant"),
    99: t("popup.skip")
  };

  const color_dict = {
    "5":"#5344A9",
    "4":"#7A5197",
    "3":"#BB5098",
    "2":"#F47F6B",
    "1":"#F5C63C"
  };

  var sum = 0;
  var max_ = 0;
  data.forEach(d => {
    sum = sum + parseInt(d.count);
    var perc = parseFloat(d.count);
    if(max_ < perc)
      max_ = perc;
  });

  const config = {
    data: data,
    x: "education_id",
    xSort: (a, b) => a.education_id - b.education_id,
    colorScale: "education_id",
    legend: false,
    y: d => parseFloat(parseFloat(d.count)*100/sum).toFixed(2),
    label: d => educationLevel[d.education_id] + " ("+parseFloat(parseFloat(d.count)*100/sum).toFixed(2)+"%)",
    shapeConfig: {
      fill: d => "#ededed"
    },
    height: 400,
    // hiddenOpacity: 1,
    colorScalePosition: false,
    backConfig : {
      ariaHidden : true,
      fontSize : 22,
      padding : 5,
      textAnchor : "middle"
    },
    yConfig: {
      titleConfig: {
        fontSize : 18,
      },
      fontSize : 22,
      title: t("results.population-title"),
      domain: [0, parseFloat(max_*100/sum).toFixed(2)]
    },
    xConfig: {
      fontSize : 22,
      title: "",
      ticks: []
    },
    tooltipConfig : {
      ariaHidden : true,
      fontSize : 12,
      fontStyle: "Source Sans Pro",
      resize : true,
      title : d => educationLevel[d.education_id] + " (" + parseInt(d.count) + " "+t("results.votes")+")"
    }
  };

  return <BarChart config={config} id={styles.bar} dataFormat={data => console.log(data)}/>;

}