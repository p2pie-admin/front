import { gql } from "graphql-request";

export const OrderIntrosQuery = gql`
  {
    orderIntros {
      data {
        id
        attributes {
          en_header
          ru_header
          en_description
          ru_description
          image {
            data {
              id
              attributes {
                name
                alternativeText
                url
              }
            }
          }
        }
      }
    }
  }
`;
