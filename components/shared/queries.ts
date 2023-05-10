import { gql } from "graphql-request";

export const exchangerQuery = gql`
  query getExchanger($id: ID) {
    exchanger(id: $id) {
      data {
        id
        attributes {
          name
          description
          logo {
            data {
              id
              attributes {
                alternativeText
                url
              }
            }
          }
          status
          tag
          date_listed
          ref_link
          admin_rating
        }
      }
    }
  }
`;
