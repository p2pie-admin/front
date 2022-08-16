import { GraphQLClient } from "graphql-request";
import normalize from "./normalizer";

// // more about https://swr.vercel.app/docs/data-fetching

const initFetcher = (variables = {}) => {
  const env = process.env.NODE_ENV;
  const url =
    env == "production"
      ? "https://strapi-latest.herokuapp.com/graphql" //process.env.NEXT_PUBLIC_GQL_PROD_URL
      : process.env.NEXT_PUBLIC_GQL_DEV_URL;

  const graphQLClient = new GraphQLClient(url || "");

  return async (query: string) => {
    const data = await graphQLClient.request(query, variables);
    return normalize(data);
  };
};

export default initFetcher;
