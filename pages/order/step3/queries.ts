import { gql } from "graphql-request";

export const CreateOrderMutation = gql`
  mutation P2P(
    $name: String
    $status: ENUM_P2P_STATUS
    $info: String
    $regulationCodes: JSON
    $dirs: JSON
    $locations: JSON
  ) {
    createP2P(
      data: {
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
