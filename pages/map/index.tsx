import type { GetStaticProps, NextPage } from "next";

const DEFAULT_CITY_SLUG = "moscow";

const MapIndexRedirect: NextPage = () => null;

export const getStaticProps: GetStaticProps = async () => ({
  redirect: {
    destination: `/map/${DEFAULT_CITY_SLUG}`,
    permanent: false,
  },
  revalidate: 60,
});

export default MapIndexRedirect;
