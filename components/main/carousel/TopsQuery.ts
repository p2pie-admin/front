import { gql } from "graphql-request";

const TopsQuery = gql`
  {
    tops {
      data {
        id
        attributes {
          ru_description
          en_description

          code
          title
          color
          image {
            data {
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
`;

export default TopsQuery;
