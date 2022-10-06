import classNames from "classnames";
import numeral from "numeral";
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {CircularProgressbar} from "react-circular-progressbar";
import {Geomap} from "d3plus-react";
import styles from "./ShowDemoMap.module.scss";
import postalCodes from "../public/custom/department.json";
import useTranslation from "next-translate/useTranslation";

function sumDuplicated(oldVector) {
  var newVector = [];
  oldVector.forEach(function(obj, ind, arr) {
    if(ind === arr.length - 1 || obj.name !== arr[ind + 1].name) 
      newVector.push(obj);
    else 
      arr[ind + 1].population += obj.population;
    
  });
  return newVector;
}

export default function DemoMap(props) {

  const {lang, t} = useTranslation("translation");
  const {data} = props;
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState(0);

  const ref = useRef();
  const [dimensions, setDimensions] = useState({width:0, height: 0});
  useLayoutEffect(() => {
    if (ref.current) {
      setDimensions({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight
      });
    }
  }, []);

  var sum = 0;
  data.forEach(function(d, index, arr) {
    data[index].department_name = "";
    sum = sum + parseInt(d.count);
    Object.keys(postalCodes).forEach(k => {
      if (parseInt(postalCodes[k].id) === parseInt(d.location_id))
        data[index].department_name = postalCodes[k].name;
    });
  });


  const config = {
    data: data,
    height: dimensions.width,
    colorScale: d => parseInt(d.count),
    colorScaleConfig: {
      scale: "log",
      color: [
        "#9ED6EC",
        "#002C81"
      ],
      fontSize : 20,
      axisConfig: {
        title: t("results.map-title"),
        fontSize : 20
      },
      titleConfig: {
        fontSize : 20
      }
    },
    projectionPadding: 0,
    totalPadding: 0,
    colorScalePosition: 0,
    groupBy: "location_id",
    ocean: "transparent",
    topojson: "/jsons/simplified_departements.json",
    tiles: false,
    topojsonKey:  d => d.properties.code, 
    topojsonId: d => d.properties.code,
    topojsonFill: "#f5f5f3",
    fitKey: "location_id",
    zoom: false,
    tooltipConfig : {
      ariaHidden : true,
      fontSize : 12,
      fontStyle: "Source Sans Pro",
      resize : true,
      title : d => d.department_name + " (" + d.count + " " + t("results.votes") +")"
    }
    
  };

  return <div ref={ref}>
    <Geomap config={config} id={styles.map_demo}/>
  </div>;

}