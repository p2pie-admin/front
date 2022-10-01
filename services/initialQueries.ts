import { gql } from "graphql-request";

export const popularQuery = gql`
  {
    popularDirs {
      data {
        id
        attributes {
          groups {
            ... on ComponentPopularPopularGroup {
              id
              pms {
                data {
                  attributes {
                    code
                    en_name
                    ru_name
                    subgroup_name
                    tag
                    icon {
                      data {
                        attributes {
                          url
                          alternativeText
                        }
                      }
                    }
                    currency {
                      data {
                        attributes {
                          code
                          accuracy
                        }
                      }
                    }
                  }
                }
              }
              icon {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
              en_name
              ru_name
            }
          }
        }
      }
    }
  }
`;
