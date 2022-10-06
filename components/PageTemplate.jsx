import React from "react";
import Navbar from "../components/Navbar";
import Footer from "./Footer";

import "./PageTemplate.scss";

export default class PageTemplate extends React.Component {
  render() {
    const {children, selected, title} = this.props;
    return <div className="page">
      <Navbar hmTitle={`${title} | AsuPrioriza`} selected={selected} />
      {/* <div className="hero">
        <h2 className="title">{title}</h2>
      </div> */}
      <div className="content">{children}</div>
      <Footer />
    </div>;
  }
}