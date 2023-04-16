import { gql } from "graphql-request";

export const TopParametersQuery = gql`
  {
    topParameters {
      data {
        id
        attributes {
          code
          parameter {
            id
            en_description
            ru_description
            icon {
              data {
                id
                attributes {
                  alternativeText
                  url
                }
              }
            }
          }
          en_name
          ru_name
        }
      }
    }
  }
`;

export const ExchangerParametersQuery = gql`
  {
    exchangerParameters {
      data {
        id
        attributes {
          code
          parameter {
            id
            en_description
            ru_description
            icon {
              data {
                id
                attributes {
                  alternativeText
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const DirectionParametersQuery = gql`
  {
    directionParameters {
      data {
        id
        attributes {
          code
          parameter {
            id
            en_description
            ru_description
            icon {
              data {
                id
                attributes {
                  alternativeText
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`;
