import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import { Box, Text } from "@chakra-ui/react";
import MainPageContent from "../components/main";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // must be async

  return {
    props: {
      ...(await serverSideTranslations(locale || "ru", ["home"])),
    },
  };
};

// const router = useRouter();
// console.log(router.query);
// const { dir, pm_groups } = router.query;

// if (typeof dir === "string" && typeof pm_groups === "string") {
//   console.log("main triggered");
//   batch(() => {
//     dispatch(restorePmsFromSlug({ dir, pm_groups }));
//     dispatch(fetchDirRates({ dir }));
//   });
// }

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <link rel="icon" href="/avatar.ico" />
        <meta name="google" content="notranslate" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 , maximum-scale=1, user-scalable=no"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@700&display=swap&text=p2ie"
          rel="stylesheet"
        />
        <link
          href="http://fonts.googleapis.com/css?family=Inconsolata&text=1234567890,.-+"
          rel="stylesheet"
        />
        <title>p2pie</title>
        <meta name="description" content="Monitoring Tool" />
      </Head>

      <MainPageContent />
    </>
  );
};

export default Home;
