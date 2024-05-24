import { gql } from "graphql-request";

//reusable not to make a mistake
const pmGroup = gql`
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
  
`;

export const pmsQuery = gql`
  {
    pms(pagination: { start: 0, limit: 1000 }) {
      data {
        id
        attributes {
          code
          popular_as
          pm_group{${pmGroup}}
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
      ${pmGroup}
    }
  }
`;

export const textLayoutsQuery = gql`
  {
    textLayouts {
      data {
        id
        attributes {
          en_layout
          ru_layout
          section_pair
        }
      }
    }
  }
`;

export const selectorQuery = gql`
  query Selector {
    selector {
      data {
        id
        attributes {
          en_give_header
          ru_give_header
          en_get_header
          ru_get_header
          search_bar {
            ru_placeholder
            en_placeholder
            ru_give_adornment
            en_give_adornment
            ru_get_adornment
            en_get_adornment
          }
          sections {
            id
            rows
            columns
            ru_title
            en_title
            pm_groups(pagination: { start: 0, limit: 1000 }) {
              ${pmGroup}
            }
          }
        }
      }
    }
  }
`;

export const citiesQuery = gql`
  {
    parserSetting {
      data {
        attributes {
          cities
        }
      }
    }
  }
`;
