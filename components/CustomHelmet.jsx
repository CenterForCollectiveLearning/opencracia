import React from "react";
import Head from "next/head";

import config from "../platform.config";

export default function CustomHelmet(props) {
  const {og_description, og_image, og_title, og_url, title = config.title} = props;

  return <div>
    <Head>
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta property="og:title" content={title} key="og_title" />
      {og_image && <meta property="twitter:image" content={og_image} key="twitter_image" />}
      {og_description && <meta property="og:description" content={og_description} key="og_description" />}
      {og_image && <meta property="og:image" content={og_image} key="og_image" />}
      {og_title && <meta property="og:title" content={og_title} key="og_title" />}
      {og_title && <meta property="twitter:title" content={og_title} key="twitter_title" />}
      {og_url && <meta property="og:url" content={og_url} key="og_url" />}
      {og_url && <meta property="twitter:url" content={og_url} key="twitter_url" />}
    </Head>
  </div>;
}