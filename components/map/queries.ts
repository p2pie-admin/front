import { gql } from "graphql-request";

export const PhysicalExchangersQuery = gql`
  {
    physicalExchangers {
      data {
        id
        attributes {
          name
          lng
          lat
          contact
          opened
          photo {
            data {
              id
              attributes {
                url
                alternativeText
              }
            }
          }
          days_off
          updatedAt
          physical_rates {
            id
            currency {
              data {
                id
                attributes {
                  accuracy
                  code
                }
              }
            }
            selling
            buying
          }
        }
      }
    }
  }
`;
