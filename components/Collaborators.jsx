import React from "react";

import styles from "./Collaborators.module.scss";

const institutions = [
  {name: "Center for Collective Learning", url: "https://centerforcollectivelearning.org", image: "/logos/ccl.svg"},
  {name: "IRIT", url: "https://irit.fr", image: "/logos/irit.png"},
  {name: "ANITI", url: "https://aniti.fr", image: "/logos/aniti.jpeg"},
  {name: "CNRS", url: "https://cnrs.fr", image: "/logos/cnrs.svg"},
  {name: "Université Paris Dauphine", url: "https://dauphine.psl.eu/", image: "/logos/paris-dauphine.png"},
  {name: "PR[AI]RIE", url: "https://prairie-institute.fr/", image: "/logos/prairie.svg"},
  {name: "Université de Toulouse Capitole (UT1)", url: "https://ut-capitole.fr", image: "/logos/ut1.png"}
];

export default function Collaborators(props) {
  return <div className={styles.collaborators}>
    {institutions.map((d, i) => <a key={`collaborators_${i}`}>
      <img className={styles.logo} src={d.image} alt={d.name} />
    </a>)}
  </div>;
}