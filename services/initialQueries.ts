import { gql } from "graphql-request";

//reusable not to make a mistake
const pmGroup = gql`
    data {
      id
      attributes {
        en_name
        ru_name
        countries
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

export const dirsTextsQuery = gql`
  query dirsText(
    $locale: I18NLocaleCode # $section_give: String # $section_get: String
  ) {
    dirsTexts(
      locale: $locale # filters: { #   section_give: { eqi: $section_give } #   section_get: { eqi: $section_get } # }
    ) {
      data {
        id
        attributes {
          section_give
          section_get
          title
          text
          updatedAt
        }
      }
    }
  }
`;

export const pmLayoutsQuery = gql`
  query pmLayout($locale: I18NLocaleCode) {
    pmLayouts(locale: $locale) {
      data {
        id
        attributes {
          section
          description
        }
      }
    }
  }
`;

export const exchangersQuery = gql`
  {
    exchangers(
      pagination: { start: 0, limit: 1000 }
      filters: {
        exchanger_card: { ru_description: { notNull: true } }
        ref_link: { notNull: true }
      }
    ) {
      data {
        id
        attributes {
          name
          ref_link
          tag
          admin_rating

          exchanger_card {
            en_description
            ru_description
            telegram
            email
            working_time
          }
        }
      }
    }
  }
`;

export const articleCodesQuery = gql`
  query Articles($locale: I18NLocaleCode) {
    articles(locale: $locale, pagination: { start: 0, limit: 1000 }) {
      data {
        attributes {
          code
        }
      }
    }
  }
`;
// export const pmLayoutsQuery = gql`
//   query pmLayout($locale: I18NLocaleCode, $sections: [String]) {
//     pmLayouts(locale: $locale, filters: { section: { in: $sections } }) {
//       data {
//         id
//         attributes {
//           section
//           description
//         }
//       }
//     }
//   }
// `;

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
            pm_groups(pagination: { start: 0, limit: 1000 } ) {
              ${pmGroup}
          }
        }
      }
    }
  }
   }
`;
//filters: { or: [ {countries: { containsi: $countries} }, {countries: {eq: null} }]}
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

export const articlesQuery = gql`
  query GetArticle($locale: I18NLocaleCode) {
    articles(locale: $locale, pagination: { start: 0, limit: 1200 }) {
      data {
        id
        attributes {
          code
          header
          subheader
          updatedAt
          chapters
          stats
        }
      }
    }
  }
`;

export const MainTextsQuery = gql`
  query MainTexts($locale: I18NLocaleCode) {
    mainTexts(locale: $locale, pagination: { start: 0, limit: 200 }) {
      data {
        id
        attributes {
          title
          description
          link {
            id
            text
            href
            isExternal
            isBlank
          }
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

export const RootTextQuery = gql`
  query TextBox($locale: I18NLocaleCode, $key: String) {
    textBoxes(locale: $locale, filters: { key: { eqi: $key } }) {
      data {
        id
        attributes {
          title
          subtitle
          text
        }
      }
    }
  }
`;

export const TopParametersQuery = gql`
  {
    topParameters(pagination: { limit: 200 }) {
      data {
        id
        attributes {
          code
          en_name
          ru_name
          parameter {
            id
            en_description
            ru_description
            icon {
              data {
                id
                attributes {
                  name
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
