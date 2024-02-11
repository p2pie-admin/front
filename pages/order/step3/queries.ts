import { gql } from "graphql-request";

export const CreateOrderMutation = gql`
  mutation P2P(
    $uid: String
    $name: String
    $status: ENUM_P2P_STATUS
    $info: String
    $regulationCodes: JSON
    $dirs: JSON
    $locations: JSON
    $ip: String
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
        ip: $ip
      }
    ) {
      data {
        id
      }
    }
  }
`;
