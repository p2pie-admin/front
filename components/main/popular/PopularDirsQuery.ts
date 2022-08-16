import { gql } from "graphql-request";

export default gql`
  {
    popularDirections {
      id
      pms {
        ... on ComponentPopularPopular {
          en_name
          ru_name
          short_name
          icon {
            url
            alternativeText
          }
          currency {
            name
            accuracy
          }
        }
      }
    }
  }
`;
