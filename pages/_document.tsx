import { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "../styles/theme";

export default function MyDocument() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        {/* Preconnect for font performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Optimized fonts with normal and bold weights */}
        <link
          href="https://fonts.googleapis.com/css2?family=Mozilla+Text:wght@400;700&family=Rubik:wght@300;700&family=Montserrat+Alternates:wght@300;700&display=swap"
          rel="stylesheet"
        />

        {/* Meta tags */}
        <meta name="google" content="notranslate" />
        {/* <meta
          name="keywords"
          content="обмен, наличные, крипта, биткойн, криптовалюта, п2п, обменять, p2p, exchange, bitcoin, crypto, monitoring, rate"
        /> */}
      </Head>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
        {/* <script src="//code.jivosite.com/widget/SuEyiBBWCg" async></script> */}
      </body>
    </Html>
  );
}
