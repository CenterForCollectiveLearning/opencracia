import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar";

import useTranslation from "next-translate/useTranslation";
import ProposalPanel from "../components/ProposalPanel";
import Loading from "../components/Loading";
import {useSelector} from "react-redux";

export default function Proposals(props) {
  const {data} = props;
  const {t, lang} = useTranslation("translation");

  const title = <h1 className="title">{t("menu.proposals")}</h1>;
  const nav =<Navbar
    // hmTitle={`${t("menu.proposals")} / ${t("website.name")}`}
    selected="proposals" />;

  // if (loading) {
  //   return <>
  //     {nav}
  //     {title}
  //     <Loading label={t("messages.loading")} />
  //   </>;
  // };

  return <>
    {nav}
    {title}
    <div className="container">

      <div className="columns">
        <div className="column">

          <ProposalPanel
            lang={lang}
            data={data}
          />
        </div>
      </div>
    </div>
  </>;
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library

  const resp = await fetch("http://localhost:3000/api/proposals");
  const data = await resp.json();

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {data}
  };
}