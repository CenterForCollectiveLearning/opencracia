import React, {useEffect} from "react";
import {FocusStyleManager} from "@blueprintjs/core";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import {v4 as uuidv4} from "uuid";
import PlausibleProvider from "next-plausible";

import Head from "next/head";

FocusStyleManager.onlyShowFocusOnTabs();

import "@fortawesome/fontawesome-svg-core/styles.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import "../styles/globals.scss";
import {shuffle} from "../helpers/utils";

// This default export is required in a new `pages/_app.js` file.
function MyApp({Component, pageProps}) {

  const description = "Plateforme qui permet aux citoyens de sélectionner et classer plus de 100 propositions extraites des programmes gouvernementaux des principaux candidats à l'élection présidentielle de 2022.";
  const image = "https://monprogramme2022.org/opengraph/desktop.jpg";
  const title = "MonProgramme";
  const url = "https://monprogramme2022.org/";

  useEffect(() => {
    const token = localStorage.getItem("mptoken");
    if (!token) 
      localStorage.setItem("mptoken", uuidv4());

    const universe = localStorage.getItem("mpuniverse");
    if (!universe) {
      const universes = [4, 5, 6];
      localStorage.setItem("mpuniverse", shuffle(universes)[0]);
    }
  }, []);

  return <PlausibleProvider
    domain="monprogramme2022.org"
  >
    <GoogleReCaptchaProvider
      reCaptchaKey="6Lf_KPMeAAAAAKa96e7sRWReZYgYYurmIQ2YlOUi"
    >
      <Head>
        <meta property="description" content={description} key="description" />
        <meta property="keywords" content="daccordle,monprogramme,elections,presidentielle,france,president france,présidentielle 2022,mon programme 2022" key="keywords" />
        <meta property="og:description" content={description} key="og_description" />
        <meta property="og:image" content={image} key="og_image" />
        <meta property="og:locale" content="fr" key="og_locale" />
        <meta property="og:title" content={title} key="og_title" />
        <meta property="og:type" content="website" key="og_type" />
        <meta property="og:url" content={url} key="og_url" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="twitter:card" content="summary" key="twitter_card" />
        <meta property="twitter:creator" content="@LearningCCL" key="twitter_creator" />
        <meta property="twitter:description" content={description} key="twitter_description" />
        <meta property="twitter:image" content={image} key="twitter_image" />
        <meta property="twitter:site" content="@LearningCCL" key="twitter_site" />
        <meta property="twitter:title" content={title} key="twitter_title" />
        <meta property="twitter:url" content={url} key="twitter_url" />
      </Head>
      <Component {...pageProps} />
    </GoogleReCaptchaProvider>
  </PlausibleProvider>;
}

export default MyApp;
// export default wrapper.withRedux(MyApp);