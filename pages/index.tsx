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
  return <MainPageContent />;
};

export default Home;
