import { gql } from "graphql-request";

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
