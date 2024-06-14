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
export const dirsTextQuery = gql`
  query dirsText(
    $locale: I18NLocaleCode
    $section_give: String
    $section_get: String
  ) {
    dirsTexts(
      locale: $locale
      filters: {
        section_give: { eqi: $section_give }
        section_get: { eqi: $section_get }
      }
    ) {
      data {
        id
        attributes {
          title
          text
        }
      }
    }
  }
`;
export const pmsTextQuery = gql`
  query TextPms($locale: I18NLocaleCode, $sections: [String]) {
    pmsTexts(locale: $locale, filters: { section: { in: $sections } }) {
      data {
        id
        attributes {
          section
          description
          articles {
            data {
              id
              attributes {
                code
              }
            }
          }
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

export const articleCodesQuery = gql`
  {
    articles(pagination: { start: 0, limit: 1000 }) {
      data {
        id
        attributes {
          code
        }
      }
    }
  }
`;

export const articleQuery = gql`
  query GetArticle($locale: I18NLocaleCode, $code: String) {
    articles(locale: $locale, filters: { code: { eq: $code } }) {
      data {
        id
        attributes {
          header
          subheader
          section
          updatedAt
          chapters {
            ... on ComponentArticleChapter {
              id
              title
              text
              link {
                id
                text
                href
                isExternal
                isBlank
              }
              disclaimer {
                id
                title
                text
                color
              }
            }
          }
        }
      }
    }
  }
`;

export const MainTextsQuery = gql`
  query MainTexts($locale: I18NLocaleCode) {
    mainTexts(locale: $locale, pagination: { start: 0, limit: 24 }) {
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

export const ParametersQuery = gql`
  {
    parameters(pagination: { limit: 200 }) {
      data {
        id
        attributes {
          code
          icon {
            data {
              id
              attributes {
                name
                alternativeText
                url
              }
            }
          }
          title
          description
          color
        }
      }
    }
  }
`;
