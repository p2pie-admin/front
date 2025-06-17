import { Html, Head, Main, NextScript } from "next/document";
import type { DocumentContext } from "next/document";

export default function Document({ locale }: { locale?: string }) {
  return (
    <Html lang={locale || "en"}>
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        {/* Preconnects */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Inconsolata&text=1234567890,.-+&display=swap"
          rel="stylesheet"
        />
        {/* Optional custom font */}
        {/* 
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@900&display=swap&text=p2ie"
          rel="stylesheet"
        /> 
        */}

        {/* Meta tags */}
        <meta name="google" content="notranslate" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta
          name="keywords"
          content="обмен, наличные, крипта, биткойн, криптовалюта, п2п, обменять, p2p, exchange, bitcoin, crypto, monitoring, rate"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async (ctx: DocumentContext) => {
  const initialProps = await ctx.defaultGetInitialProps(ctx);
  return {
    ...initialProps,
    locale: ctx.locale, // get locale from context
  };
};
