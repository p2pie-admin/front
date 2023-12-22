import { gql } from "graphql-request";

export const RegulationsQuery = gql`
  {
    regulationGroups {
      data {
        id
        attributes {
          en_title
          ru_title
          regulations {
            ... on ComponentP2PRegulationItem {
              id
              en_title
              ru_title
              en_description
              ru_description
              default_checked
              has_article
            }
          }
        }
      }
    }
  }
`;
