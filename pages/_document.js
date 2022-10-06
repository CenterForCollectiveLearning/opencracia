import React from "react";
import {Html, Head, Main, NextScript} from "next/document";
import Script from "next/script";


const GOOGLE_ANALYTICS = "G-VNCNN3BD9F";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS}`}
        /> */}
        {/* <Script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        /> */}
        <link rel="shortcut icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <body style={{margin: 0}}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}