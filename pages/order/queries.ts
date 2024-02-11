import { gql } from "graphql-request";

export const OrderByIPQuery = gql`
  query orderByIP($ip: String) {
    p2Ps(filters: { ip: { eq: $ip } }) {
      data {
        id
        attributes {
          uid
          ip
          name
          info
          status
          dirs
          regulationCodes
          locations
        }
      }
    }
  }
`;

export const StepsQuery = gql`
  {
    steps {
      data {
        id
        attributes {
          en_title
          ru_title
          en_description
          ru_description
          en_stepper_title
          ru_stepper_title
          en_stepper_description
          ru_stepper_description
        }
      }
    }
  }
`;
