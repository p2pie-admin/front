import type { GetServerSideProps, NextPage } from "next";

const DEFAULT_CITY_SLUG = "moscow";

const MapIndexRedirect: NextPage = () => null;

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: `/map/${DEFAULT_CITY_SLUG}`,
    permanent: false,
  },
});

export default MapIndexRedirect;
