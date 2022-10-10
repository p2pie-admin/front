import { GraphQLClient } from "graphql-request";
import normalize from "./normalizer";

// // more about https://swr.vercel.app/docs/data-fetching

const initFetcher = (variables = {}) => {
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

export default initFetcher;
