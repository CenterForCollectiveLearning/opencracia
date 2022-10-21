import React, {useEffect} from "react";
import {FocusStyleManager} from "@blueprintjs/core";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import {v4 as uuidv4} from "uuid";
import store, {properties, users} from "../store/store";
import {Provider, useDispatch} from "react-redux";


import Head from "next/head";

FocusStyleManager.onlyShowFocusOnTabs();

import "@fortawesome/fontawesome-svg-core/styles.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import "../styles/globals.scss";
import {shuffle} from "../helpers/utils";


// This default export is required in a new `pages/_app.js` file.
function MyApp({Component, pageProps}) {

  const description = "";
  const image = "https://demo.opencracia.org/opengraph/desktop.jpg";
  const keywords = "opencracia,monprogramme,brazucracia,chilecracia,elections";
  const primaryLanguage = "en";
  const title = "Opencracia";
  const twitter = "@LearningCCL";
  const url = "https://demo.opencracia.org/";

  useEffect(async() => {
    const token = localStorage.getItem("mptoken");
    if (!token) 
      localStorage.setItem("mptoken", uuidv4());
      
    // const module = shuffle(process.env.UNIVERSES.split(","))[0];
    // store.dispatch(properties.actions.updateModule(module));

    // const universe = localStorage.getItem("mpuniverse");
    // if (!universe) {
    //   const universes = [4, 5, 6];
    //   localStorage.setItem("mpuniverse", shuffle(universes)[0]);
    // }

    // store.dispatch(properties.actions.updateBallotSize(5)); //  || universe * 1
    store.dispatch(users.actions.updateToken(token));

  }, []);

  return <Provider store={store}>
    <GoogleReCaptchaProvider
      reCaptchaKey="6Lf_KPMeAAAAAKa96e7sRWReZYgYYurmIQ2YlOUi"
    >
      <Head>
        <meta property="description" content={description} key="description" />
        <meta property="keywords" content={keywords} key="keywords" />
        <meta property="og:description" content={description} key="og_description" />
        <meta property="og:image" content={image} key="og_image" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:locale" content={primaryLanguage} key="og_locale" />
        <meta property="og:title" content={title} key="og_title" />
        <meta property="og:type" content="website" key="og_type" />
        <meta property="og:url" content={url} key="og_url" />
        <meta property="twitter:card" content="summary" key="twitter_card" />
        <meta property="twitter:creator" content={twitter} key="twitter_creator" />
        <meta property="twitter:description" content={description} key="twitter_description" />
        <meta property="twitter:image" content={image} key="twitter_image" />
        <meta property="twitter:site" content={twitter} key="twitter_site" />
        <meta property="twitter:title" content={title} key="twitter_title" />
        <meta property="twitter:url" content={url} key="twitter_url" />
      </Head>
      <Component {...pageProps} />
    </GoogleReCaptchaProvider>
  </Provider>;
}

export default MyApp;