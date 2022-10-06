import React from "react";
import Member from "../components/Member";
import styles from "./Team.module.scss";
import useTranslation from "next-translate/useTranslation";

export default function Team(props) {

  const {lang, t} = useTranslation("translation");
  const seniors = [
    {
      name: "César A. Hidalgo",
      photo: "/team/cesar-hidalgo.jpeg",
      text: t("about.cesar"),
    },
    {
      name: "Jérôme Lang", 
      photo: "/team/jerome-lang.jpeg",
      text:  t("about.jerome"),
    },
    {
      name: "Umberto Grandi", 
      photo: "/team/umberto-grandi.jpeg", 
      text: t("about.umberto")
    }
  ];
  
  const juniors = [
    {name: "Carlos Navarrete", photo: "/team/carlos-navarrete.jpeg", text: t("about.carlos")},
    {name: "Jingling Zhang", photo: "/team/jingling-zhang.jpeg", text: t("about.jingling")},
    {name: "Nicole Ferrada", photo: "/team/nicole-ferrada.jpeg", text: t("about.nicole")},
    {name: "Mariana Macedo", photo: "/team/mariana-macedo.jpeg", text: t("about.mariana")},
    {name: "Rachael Colley", photo: "/team/rachael-colley.jpeg", text: t("about.rachael")},
  ];
  
  return <div className={styles.team}>
    <h2 className="title">{t("about.team")}</h2><h3>{t("about.juniors")}</h3>
    {juniors.map(d => <Member key={`member_${d.name}`} {...d} />)}
    <h3>{t("about.seniors")}</h3>
    {seniors.map(d => <Member key={`member_${d.name}`} {...d} />)}</div>;
}