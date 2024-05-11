import { gql } from "graphql-request";

export const pmsQuery = gql`
  {
    pms(pagination: { start: 0, limit: 1000 }) {
      data {
        id
        attributes {
          code
          popular_as
          pm_group {
            data {
              id
              attributes {
                en_name
                ru_name
                prefix
                options {
                  ... on ComponentSelectorSubgroup {
                    id
                    name
                    code
                    currency {
                      data {
                        id
                        attributes {
                          code
                          accuracy
                        }
                      }
                    }
                  }
                  ... on ComponentSelectorCurrency {
                    id
                    currency {
                      data {
                        id
                        attributes {
                          code
                          accuracy
                        }
                      }
                    }
                  }
                }
                color

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
    }
  }
`;

export const pmGroupsQuery = gql`
  {
    pmGroups(pagination: { start: 0, limit: 1000 }) {
      data {
        id
        attributes {
          en_name
          ru_name
          prefix
          color
          options {
            ... on ComponentSelectorCurrency {
              id
              currency {
                data {
                  id
                  attributes {
                    code
                    accuracy
                  }
                }
              }
            }
            ... on ComponentSelectorSubgroup {
              id
              name
              code
              currency {
                data {
                  id
                  attributes {
                    code
                    accuracy
                  }
                }
              }
            }
          }
          icon {
            data {
              id
              attributes {
                url
                alternativeText
              }
            }
          }
        }
      }
    }
  }
`;

export const pmGroupsByNamesQuery = gql`
  query pmGroupsByNames($giveName: String, $getName: String) {
    pmGroups(
      filters: {
        or: [{ en_name: { eqi: $giveName } }, { en_name: { eqi: $getName } }]
      }
    ) {
      data {
        id
        attributes {
          en_name
          options {
            ... on ComponentSelectorSubgroup {
              currency {
                data {
                  attributes {
                    code
                  }
                }
              }
            }
            ... on ComponentSelectorCurrency {
              currency {
                data {
                  attributes {
                    code
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
