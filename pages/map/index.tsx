import type { GetStaticProps } from "next";

const DEFAULT_CITY_SLUG = "moscow";

export const getStaticProps: GetStaticProps = async () => {
  return {
    redirect: {
      destination: `/map/${DEFAULT_CITY_SLUG}`,
      permanent: false,
    },
  };
};

const MapIndexRedirect = () => null;

export default MapIndexRedirect;
