import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../styles/theme";
import Layout from "../components/layout";
import store from "../redux/store";
import { Provider } from "react-redux";
import { appWithTranslation } from "next-i18next";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import { defaultConfig } from "../next-seo.config";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Head from "next/head";
import "../i18n"; //
import { useEffect, useRef } from "react";
import { useAppDispatch } from "../redux/hooks";
import { setLoadingStatus } from "../redux/mainReducer";
import { locale as siteLocale } from "../services/utils";

const RouteLoadingHandler = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleStart = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      dispatch(setLoadingStatus("pending"));

      timeoutRef.current = setTimeout(() => {
        dispatch(setLoadingStatus("fulfilled"));
        timeoutRef.current = null;
      }, 5000);
    };

    const handleFinish = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      dispatch(setLoadingStatus("fulfilled"));
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleFinish);
    router.events.on("routeChangeError", handleFinish);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleFinish);
      router.events.off("routeChangeError", handleFinish);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [router.events, dispatch]);

  return null;
};

function MyApp({ Component, pageProps }: AppProps) {
  const seoConfig = defaultConfig[siteLocale || "ru"];

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
      <ChakraProvider theme={theme}>
        <Provider store={store}>
          <Layout>
            <RouteLoadingHandler />
            <SpeedInsights />
            <DefaultSeo {...seoConfig} />
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </ChakraProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
