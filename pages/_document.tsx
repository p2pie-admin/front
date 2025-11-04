import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "../styles/theme";

type MyDocumentProps = DocumentInitialProps & {
  nonce?: string;
};

class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<MyDocumentProps> {
    const initialProps = await Document.getInitialProps(ctx);
    const nonceHeader = ctx.req?.headers["x-nonce"];
    const nonce = Array.isArray(nonceHeader) ? nonceHeader[0] : nonceHeader;

    return { ...initialProps, nonce };
  }

  render() {
    const { nonce } = this.props;

    return (
      <Html>
        <Head>
          {/* Favicon */}
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />

          {/* Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />

          <link
            href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
            rel="stylesheet"
          />

          {/* Meta tags */}
          <meta name="google" content="notranslate" />
          <meta
            name="keywords"
            content="обмен, наличные, крипта, биткойн, криптовалюта, п2п, обменять, p2p, exchange, bitcoin, crypto, monitoring, rate"
          />
        </Head>
        <body>
          <ColorModeScript
            nonce={nonce}
            initialColorMode={theme.config.initialColorMode}
          />
          <Main />
          <NextScript nonce={nonce} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
