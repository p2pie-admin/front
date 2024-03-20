import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Box, ChakraProvider } from "@chakra-ui/react";
import theme from "../styles/theme";
import Layout from "../components/layout";
import store from "../redux/store";
import { Provider } from "react-redux";
import { appWithTranslation } from "next-i18next";
import HeadHTML from "../components/layout/HeadHTML";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <Layout>
          <HeadHTML />
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </ChakraProvider>
  );
}

export default appWithTranslation(MyApp);
