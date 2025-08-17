import axios from "axios";
import { GraphQLClient } from "graphql-request";
import normalize from "./normalizer";
import { mylog } from "./utils";

const retry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn(); // <-- added await
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr;
};
const unwrap = (data: any) => {
  if (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    Object.keys(data).length === 1
  ) {
    return data[Object.keys(data)[0]];
  }
  return data;
};

export const initCMSFetcher = () => {
  const env = process.env.NODE_ENV;
  const url =
    env === "production"
      ? process.env.NEXT_PUBLIC_STRAPI_PROD_BASE_URL + "/graphql"
      : process.env.NEXT_PUBLIC_STRAPI_DEV_BASE_URL + "/graphql";

  const graphQLClient = new GraphQLClient(url || "", { timeout: 15000 });

  return async (query: string, variables?: Record<string, any>) => {
    try {
      const data = await retry(() => graphQLClient.request(query, variables));
      return unwrap(normalize(data));
    } catch (e) {
      mylog("variables", "important");
      mylog(variables, "important");
      mylog("query", "important");
      mylog(query.slice(0, 100), "important");
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
      mylog("url", "important");
      mylog(url, "important");
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
