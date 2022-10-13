import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/avatar.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sriracha&text=Cotleta"
          rel="stylesheet"
        />
        <link
          href="http://fonts.googleapis.com/css?family=Inconsolata&text=1234567890,.-+"
          rel="stylesheet"
        />
      </Head>
      <body style={{ backgroundColor: "#26222d" }}>
        {" "}
        {/* чтобы не мигала при смене языка */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
