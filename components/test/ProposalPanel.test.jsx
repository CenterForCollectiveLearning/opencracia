import React, {useEffect, useState} from "react";
import {render, screen} from "@testing-library/jest-dom";
import * as ReactDom from "react-dom";
import ProposalPanel from "../ProposalPanel";
import {getByLabelText, getByText} from "@testing-library/react";
import fetch from "node-fetch";


// const data  = [{"id":1,"multichoice":0,"fr_category":"Social & Solidarité","fr":"Verser les allocations aux adultes handicapés (AAH) indépendamment des revenus du conjoint","fr_multichoice":null,"en_category":"Social & Solidarity","en":"Pay adult disability benefits independenly from the revenue of the spouse.","en_multichoice":null,"es_category":"Social y Solidaridad","es":"Pagar las asignaciones de adultos indicadas (AAH) independientemente del ingreso del cónyuge","es_multichoice":null},{"id":2,"multichoice":0,"fr_category":"Social & Solidarité","fr":"Bloquer les prix des produits de première nécessité : gaz, électricité, alimentation","fr_multichoice":null,"en_category":"Social & Solidarity","en":"Cap prices of essential products: gas, electricity, food.","en_multichoice":null,"es_category":"Social y Solidaridad","es":"Fijar un precio máximo para servicios y productos de primera necesidad: gas, electricidad, alimentos","es_multichoice":null},{"id":3,"multichoice":0,"fr_category":"Social & Solidarité","fr":"Réserver les aides sociales aux personnes de nationalité francaise","fr_multichoice":null,"en_category":"Social & Solidarity","en":"Reserve social security assistance only for people of French nationality.","en_multichoice":null,"es_category":"Social y Solidaridad","es":"Reservar las ayudas sociales sólo para las personas de nacionalidad francesa.","es_multichoice":null},{"id":4,"multichoice":0,"fr_category":"Social & Solidarité","fr":"Restaurer l'universalité des allocations familiales (qui seront versées indépendemment des ressources)","fr_multichoice":null,"en_category":"Social & Solidarity","en":"Pay family allowance independently of family resources.","en_multichoice":null,"es_category":"Social y Solidaridad","es":"Restaurar la universalidad de las asignaciones familiares (que se pagará de forma independiente)","es_multichoice":null}];


test("ProposalPanel", () => {

  const Timeout = setTimeout(function alfa() {
    console.log("Timeout for 1000ms");
  }, 1000);

  const data = fetch("http://localhost:3002/api/proposals").then(resp => resp.json());
  const tmpObj = Object.keys(data).sort().reduce(
    (obj, key) => { 
      obj[key] = data[key]; 
      return obj;
    }, 
    {}
  );

  const div = document.createElement("ProposalPanel");

  const lang = "fr";

  ReactDom.render(<ProposalPanel
    lang={lang}
    data={tmpObj} />, div);
  console.log("call back will be invoked");

  

});

