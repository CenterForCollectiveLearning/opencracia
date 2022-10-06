import classNames from "classnames";
import numeral from "numeral";
import React, {useEffect, useState} from "react";
import {BarChart} from "d3plus-react";
import useTranslation from "next-translate/useTranslation";
import styles from "./ShowAgePlot.module.scss";

export default function ShowBarPlot(props) {
  
  const {lang, t} = useTranslation("translation");
  const {data} = props;
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.screen.width);
  }, []);
  
  const ageOptions = {
    1 : "10-20 " + t("results.age-name"),
    2 : "20-30 " + t("results.age-name"),
    3 : "30-40 " + t("results.age-name"),
    4 : "40-50 " + t("results.age-name"),
    5 : "50-60 " + t("results.age-name"),
    6 : "60-70 " + t("results.age-name"),
    7 : "70-80 " + t("results.age-name"),
    98 : t("popup.other"),
    99 : t("popup.skip")
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
    discrete: "y",
    groupby: "age_id",
    stacked: true,
    y: "age_id",
    ySort: (a, b) => a.age_id - b.age_id,
    // colorScale: "age_id",
    // legend: false,
    x: d => parseFloat(parseFloat(d.count)*100/sum).toFixed(2),
    label: d => ageOptions[d.age_id] + " ("+parseFloat(parseFloat(d.count)*100/sum).toFixed(2)+"%)",
    shapeConfig: {
      fill: d => "#ededed"
    },
    height: 400,
    // hiddenOpacity: 1,
    yConfig: {
      fontSize : 22,
      title: "",
      ticks: []
    },
    tooltipConfig : {
      ariaHidden : true,
      fontSize : 12,
      fontStyle: "Source Sans Pro",
      resize : true,
      title : d => ageOptions[d.age_id] + " (" + d.count + " "+t("results.votes")+")"
    }
  };

  return <BarChart config={config} id={styles.bar} dataFormat={data => console.log(data)}/>;

}