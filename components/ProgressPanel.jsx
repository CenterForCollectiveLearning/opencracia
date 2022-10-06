import React from "react";
import {ProgressBar} from "@blueprintjs/core";

import "./ProgressPanel.scss";

export default function ProgressPanel(props) {
  const {count, threshold} = props;

  return <div className="tab-panel">
    <div className="model-progress">
      <ProgressBar
        value={count / threshold}
      />
    </div>
  </div>;
}