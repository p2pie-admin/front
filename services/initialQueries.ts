import { gql } from "graphql-request";

export const pmsQuery = gql`
  {
    pms {
      data {
        id
        attributes {
          code
          pm_group {
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
          }
        }
      }
    }
  }
`;

export const pmGroupQuery = gql`
  query getPmGroup($id: ID) {
    pmGroup(id: $id) {
      data {
        id
        attributes {
          en_name
          ru_name
          prefix
          color
          options {
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
          }
          icon {
            data {
              id
              attributes {
                url
                alternativeText
              }
            }
          }
        }
      }
    }
  }
`;
// export const pmsQuery = gql`
//   {
//     popularDirs {
//       data {
//         id
//         attributes {
//           groups {
//             ... on ComponentPopularPopularGroup {
//               id
//               icon {
//                 data {
//                   id
//                   attributes {
//                     url
//                     alternativeText
//                   }
//                 }
//               }
//               en_name
//               ru_name
//               pms {
//                 data {
//                   id
//                   attributes {
//                     code
//                     pm_group {
//                       data {
//                         id
//                         attributes {
//                           en_name
//                           ru_name
//                           prefix
//                           color
//                           options {
//                             ... on ComponentSelectorCurrency {
//                               currency {
//                                 data {
//                                   id
//                                   attributes {
//                                     code
//                                     accuracy
//                                   }
//                                 }
//                               }
//                             }
//                             ... on ComponentSelectorSubgroup {
//                               id
//                               name
//                               code
//                               currency {
//                                 data {
//                                   id
//                                   attributes {
//                                     code
//                                     accuracy
//                                   }
//                                 }
//                               }
//                             }
//                           }
//                           icon {
//                             data {
//                               id
//                               attributes {
//                                 url
//                                 alternativeText
//                               }
//                             }
//                           }
//                         }
//                       }
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
