import { gql } from "graphql-request";

export const CreateOrderMutation = gql`
  mutation P2P(
    $uid: String
    $status: ENUM_P2P_STATUS
    $info: String
    $regulationCodes: JSON
    $dirs: JSON
    $locations: JSON
  ) {
    createP2P(
      data: {
        uid: $uid
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
