import axios from "axios";
import { GraphQLClient } from "graphql-request";
import normalize from "./normalizer";

// // more about https://swr.vercel.app/docs/data-fetching

export const initCMSFetcher = (variables = {}) => {
  const env = process.env.NODE_ENV;
  const url =
    env == "production"
      ? process.env.NEXT_PUBLIC_STRAPI_PROD_BASE_URL + "/graphql"
      : process.env.NEXT_PUBLIC_STRAPI_DEV_BASE_URL + "/graphql";

  const graphQLClient = new GraphQLClient(url || "");

  return async (query: string) => {
    const data = await graphQLClient.request(query, variables);
    return normalize(data);
  };
};

export const initParserFetcher = () => {
  const env = process.env.NODE_ENV;
  const url =
    env == "production"
      ? process.env.NEXT_PUBLIC_COURSE_FILTER_PROD_URL
      : process.env.NEXT_PUBLIC_COURSE_FILTER_DEV_URL;

  return async (slug: string) => {
    const { data } = await axios.get(url + "/" + slug);
    return data;
  };
};

export const initCurrencyConverterFetcher = (p2pDirIndex?: number) => {
  const env = process.env.NODE_ENV;
  const url =
    env == "production"
      ? process.env.NEXT_PUBLIC_CURRENCY_CONVERTER_PROD_URL
      : process.env.NEXT_PUBLIC_CURRENCY_CONVERTER_DEV_URL;

  return async (dir: string) => {
    const { data } = await axios.get(url + "/" + dir.toUpperCase());
    return { data, p2pDirIndex };
  };
};
