import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import { Box, Text } from "@chakra-ui/react";
import Main from "../components/main";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // must be async
  return {
    props: {
      ...(await serverSideTranslations(locale || "ru", ["home"])),
    },
  };
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Cotleta</title>
        <meta name="description" content="Monitoring Tool" />
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

      <Main />
    </>
  );
};

export default Home;
