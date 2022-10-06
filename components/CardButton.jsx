import React from "react";

import "./CardButton.scss";

export default function CardButton(props) {
  const {callback, children} = props;
  return <div 
    className="card-button" 
    onClick={callback}>
    {children}
  </div>;
}