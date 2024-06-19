import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Box, ChakraProvider } from "@chakra-ui/react";
import theme from "../styles/theme";
import Layout from "../components/layout";
import store from "../redux/store";
import { Provider } from "react-redux";
import { appWithTranslation, useTranslation } from "next-i18next";
import HeadHTML from "../components/layout/HeadHTML";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import { defaultConfig } from "../next-seo.config";

function MyApp({ Component, pageProps }: AppProps) {
  const { locale } = useRouter() as { locale: "en" | "ru" };
  const seoConfig = defaultConfig[locale || "ru"];
  return (
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <Layout>
          <DefaultSeo {...seoConfig} />
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </ChakraProvider>
  );
}

export default appWithTranslation(MyApp);
