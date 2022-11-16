import React, {useState} from "react";
import Approval from "./Approval";
import Rank from "./Rank";
import {useSelector} from "react-redux";

import store, {properties, users} from "../store/store";
import {shuffle} from "../helpers/utils";

const filterAlternatives = (data, filterable=true) => data.reduce((all, d) => {
  if (filterable) {
    if (d.selected === 1)
      all.push(d.id.toString());
  }
  else
    all.push(d.id.toString());
  return all;
}, []);

export default function Fallback(props) {
  const {data, dataSelectedAll} = props;
  const [step, setStep] = useState(0);
  const {memory} = useSelector(state => state.properties);
  const allData = useSelector(state => state.properties.data);

  const approvedIdsBallot = filterAlternatives(data, false);
  const approvedIds = filterAlternatives(memory);

  let tempData = data.filter(d => approvedIds.includes(d.id.toString()));

  if (data.length > tempData.length) {
    const candidates = allData.filter(d => 
      approvedIds.includes(d.id.toString()) && 
      !approvedIdsBallot.includes(d.id.toString())
    );
    const N = data.length - tempData.length;
    tempData = tempData.concat(shuffle(candidates).slice(0, N));
  }

  tempData = shuffle(tempData);
 
  if (step === 0) {
    return <Approval 
      data={data}
      isFallback={true}
      callback={() => setStep(1)}
      dataSelectedAll={dataSelectedAll}
    />;
  }

  else {
    return <Rank 
      data={tempData} // dataFiltered
      isFallback={true}
      callback={() => setStep(0)}
    />;
  }
}