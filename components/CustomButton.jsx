import Link from "next/link";
import React from "react";

import styles from "./CustomButton.module.scss";

export default function CustomButton(props) {
  const {href, label} = props;
  return <Link href={href}><a className={styles.button}>{label}</a></Link>;
}