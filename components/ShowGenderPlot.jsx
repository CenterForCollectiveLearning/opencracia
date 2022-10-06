import classNames from "classnames";
import numeral from "numeral";
import React, {useEffect, useState} from "react";
import {Donut} from "d3plus-react";
import useTranslation from "next-translate/useTranslation";
import styles from "./ShowGenderPlot.module.scss";
import {t} from "i18next";

export default function GenderStatisticsPlot(props) {
  
  const {lang, t} = useTranslation("translation");
  const {data} = props;
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.screen.width);
  }, []);

  const color_dict = {
    // "2":"#166609",
    // "1":"#f0df5d",
    "2":"#ededed",
    "1":"#ededed"
  };

  const gender_dict = {
    "2": t("popup.sex-male"),
    "1": t("popup.sex-female")
  };

  var sum = 0;
  data.forEach(d => {
    sum = sum + parseInt(d.count);
  });


  const config = {
    data: data,
    colorScale: "sex_id",
    legend: false,
    groupBy: "sex_id",
    value: d => (d.count*1),
    label: d => gender_dict[d.sex_id] + " ("+parseFloat(d.count*100/sum).toFixed(2)+"%)",
    shapeConfig: {
      fill: d => color_dict[d.sex_id],
      strokeConfig: 4,
      Line: {
        strokeConfig: 4,
        color: "#4583BD"
      },
    },
    height: 400,
    totalPadding: 100,
    backConfig : {
      ariaHidden : true,
      fontSize : 22,
      padding : 5,
      resize : false,
      textAnchor : "middle"
    },
    // hiddenOpacity: 1, 
    tooltipConfig : {
      ariaHidden : true,
      fontSize : 12,
      fontStyle: "Source Sans Pro",
      resize : true,
      title : d => gender_dict[d.sex_id] + " (" + d.count + " "+t("results.votes")+")"
    }
  };

  return <Donut config={config} id={styles.bar} dataFormat={data => console.log(data)}/>;

}