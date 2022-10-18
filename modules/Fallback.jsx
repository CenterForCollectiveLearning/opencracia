import React from "react";
import {useState} from "react";
import Approval from "./Approval";
import Rank from "./Rank";

export default function Fallback(props) {
  const {data, dataSelectedAll} = props;
  const [step, setStep] = useState(0);
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
      data={data} // dataFiltered
      isFallback={true}
      callback={() => setStep(0)}
    />;
  }
}