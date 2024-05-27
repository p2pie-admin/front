import { gql } from "graphql-request";

export const TopParametersQuery = gql`
  {
    topParameters(pagination: { start: 0, limit: 100 }) {
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
    exchangerParameters(pagination: { start: 0, limit: 100 }) {
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
    directionParameters(pagination: { start: 0, limit: 100 }) {
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

export const CreateRedirectMutation = gql`
  mutation CreateRedirect(
    $direction: String
    $id_related_to: String
    $isP2P: Boolean
    $give: Float
    $get: Float
    $ip: String
  ) {
    createRedirect(
      data: {
        direction: $direction
        give: $give
        get: $get
        id_related_to: $id_related_to
        isP2P: $isP2P
        ip: $ip
      }
    ) {
      data {
        id
      }
    }
  }
`;
