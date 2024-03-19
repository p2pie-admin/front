import React from "react";
import Head from "next/head";

export default function LayoutHeader() {
  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta
        name="keywords"
        content="обмен, наличные, крипта, биткойн, криптовалюта, п2п, обменять, p2p, exchange, bitcoin, crypto, monitoring, rate"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Balsamiq+Sans:wght@700&family=Nunito:ital,wght@0,300;0,700;0,900;1,600&family=Varela+Round&display=swap"
        rel="stylesheet"
      />

      <meta
        name="description"
        content="Агрегатор обменных пунктов. Инструмент поиска лучших предложений обмена электронных, наличных и криптовалют."
      />
      <meta name="apple-mobile-web-app-capable" content="yes" />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://metatags.io/" />
      <meta
        property="og:title"
        content="AllChange - поиск лучших курсов обмена"
      />
      <meta
        property="og:description"
        content="Агрегатор обменных пунктов. Инструмент поиска лучших предложений обмена электронных, наличных и криптовалют."
      />
      <meta
        property="og:image"
        content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"
      />
    </Head>
  );
}
