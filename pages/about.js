import React, {useEffect, useState} from "react";
import Team from "../components/Team";
import Navbar from "../components/Navbar";
import AboutDescription from "../components/AboutDescription";
import Collaborators from "../components/Collaborators";
import useTranslation from "next-translate/useTranslation";

export default function About() {
  const {lang, t} = useTranslation("translation");
  const text = {};
  
  text.fr = <>
    <p>Monprogramme est une plate-forme destinée à apprendre les préférences des citoyens. Nous sommes une équipe de chercheur.se.s et nous travaillons sur le choix social comportemental et la conception de plates-formes  de démocratie numérique.</p>
    <p>Les données récoltées dans Monprogramme sont anonymisées juste après le remplissage du questionnaire. La conception de la plate-forme a été approuvée par le Comité d&apos;examen TSE-IAST pour les normes éthiques dans la recherche (https://www.iast.fr/fr/ethique). Les données de Monprogramme seront utilisées pour une recherche académique sur l&apos;amélioration de la conception de plateformes de démocratie numérique et l&apos;étude de la structure des préférences politiques des citoyens. </p>
  </>;

  text.en = <>
    <p>Monprogramme is a platform designed to learn about citizen&apos;s preferences. We are a group of scientists working to push the empirical boundaries of social choice theory and to explore the design of digital democracy platforms.</p>
    <p>The data collected in Monprogramme is anonymized at the moment of data collection. The platform design was approved by the TSE-IAST Review Board for Ethical Standards in Research (https://www.iast.fr/fr/ethique). Monprogramme data will be used for academic research focused on improving the design of digital democracy interfaces and studying the structure of citizen&apos;s political preferences. </p>
    {/* <p>Monprogramme was created by a team of scientists at the Center for Collective Learning at the University of Toulouse&apos;s ANITI in collaboration with scholars from CNRS, Paris Dauphine University, and IRIT.</p> */}
  </>;

  useEffect(async() => {
  
  }, []);

  const navBar =<Navbar
    hmTitle={`${t("menu.about")} / MonProgramme`}
    selected="about"
  />;

  return <>
    {navBar}
    <div className="container">
      <h1 className="title">{t("menu.about")}</h1>

      <div style={{padding: 10}}>
        <div className="columns">
          <div className="column">

            <AboutDescription data={t("about.summary")}/>
            {/* <Team /> */}

            <h2 className="title">{t("about.collaborators")}</h2>
            <Collaborators />
          </div>
        </div>
      </div></div>
  </>;
}