import axios from "axios";
import { GraphQLClient } from "graphql-request";
import normalize from "./normalizer";

const retry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries - 1) {
        console.warn(`Retry ${attempt + 1} failed. Retrying...`);
      }
    }
  }
  throw lastError;
};

export const initCMSFetcher = (variables = {}) => {
  const env = process.env.NODE_ENV;
  const url =
    env === "production"
      ? process.env.NEXT_PUBLIC_STRAPI_PROD_BASE_URL + "/graphql"
      : process.env.NEXT_PUBLIC_STRAPI_DEV_BASE_URL + "/graphql";

  const graphQLClient = new GraphQLClient(url || "", { timeout: 15000 });

  return async (query: string) => {
    try {
      const data = await retry(() => graphQLClient.request(query, variables));
      return normalize(data);
    } catch (e) {
      console.error("CMS FETCHER ERROR after 3 retries: ", e);
      return null;
    }
  };
};

export const initParserFetcher = () => {
  const env = process.env.NODE_ENV;
  const url =
    env === "production"
      ? process.env.NEXT_PUBLIC_PARSER_PROD_URL
      : process.env.NEXT_PUBLIC_PARSER_DEV_URL;

  return async (slug: string) => {
    try {
      const { data } = await retry(() => axios.get(url + "/" + slug));
      return data;
    } catch (e) {
      console.error("PARSER FETCHER ERROR after 3 retries: ", e);
      return null;
    }
  };
};

export const initCurrencyConverterFetcher = (p2pDirIndex?: number) => {
  const env = process.env.NODE_ENV;
  const url =
    env === "production"
      ? process.env.NEXT_PUBLIC_CONVERTER_PROD_URL
      : process.env.NEXT_PUBLIC_CONVERTER_DEV_URL;

  return async (currenciesPair?: string) => {
    const fullUrl =
      url + "/" + (currenciesPair ? currenciesPair.toUpperCase() : "");
    try {
      const { data } = await retry(() => axios.get(fullUrl));
      return { data, p2pDirIndex };
    } catch (e) {
      console.error("CONVERTER FETCHER ERROR after 3 retries: ", e);
      return { data: null, p2pDirIndex };
    }
  };
};
