import React, {useEffect, useRef, useState} from "react";
import {render, screen} from "@testing-library/jest-dom";
import * as ReactDom from "react-dom";
import CustomButton from "../CustomButton";
import {getByLabelText, getByText} from "@testing-library/react";


test("CustomButton", () => {
  const div = document.createElement("href");
  ReactDom.render(<CustomButton href="www.clickme.br" label="Label"/>, div);

});