// import { gql } from "graphql-request";

// export const pmsByCurrencyQuery = gql`
//   query getPmsByCurrency($codeLowerCase: String, $codeUpperCase: String) {
//     pms(
//       filters: {
//         or: [
//           { code: { endsWith: $codeLowerCase } }
//           { code: { endsWith: $codeUpperCase } }
//         ]
//       }
//     ) {
//       data {
//         id
//         attributes {
//           code
//           popular_as
//           pm_group {
//             data {
//               id
//               attributes {
//                 en_name
//                 ru_name
//                 prefix
//                 options {
//                   ... on ComponentSelectorSubgroup {
//                     id
//                     name
//                     code
//                     currency {
//                       data {
//                         id
//                         attributes {
//                           code
//                           accuracy
//                         }
//                       }
//                     }
//                   }
//                   ... on ComponentSelectorCurrency {
//                     id
//                     currency {
//                       data {
//                         id
//                         attributes {
//                           code
//                           accuracy
//                         }
//                       }
//                     }
//                   }
//                 }
//                 color

//                 icon {
//                   data {
//                     id
//                     attributes {
//                       alternativeText
//                       url
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;
