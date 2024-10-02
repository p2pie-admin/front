import { gql } from "graphql-request";

export const GetIDFromUIDQuery = gql`
  {
    p2Ps(filters: { uid: { eq: "ref_lsjnrtmgpie" } }) {
      data {
        id
      }
    }
  }
`;

export const UpdateOrderMutation = gql`
  mutation P2P(
    $id: ID!
    $uid: String
    $name: String
    $status: ENUM_P2P_STATUS
    $info: String
    $regulationCodes: JSON
    $dirs: JSON
    $locations: JSON
  ) {
    updateP2P(
      id: $id
      data: {
        uid: $uid
        name: $name
        status: $status
        info: $info
        regulationCodes: $regulationCodes
        dirs: $dirs
        locations: $locations
      }
    ) {
      data {
        id
      }
    }
  }
`;
export const CreateOrderMutation = gql`
  mutation P2P(
    $uid: String
    $name: String
    $status: ENUM_P2P_STATUS
    $info: String
    $regulationCodes: JSON
    $dirs: JSON
    $locations: JSON
  ) {
    createP2P(
      data: {
        uid: $uid
        name: $name
        status: $status
        info: $info
        regulationCodes: $regulationCodes
        dirs: $dirs
        locations: $locations
      }
    ) {
      data {
        id
      }
    }
  }
`;
