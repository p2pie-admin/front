import { gql } from "graphql-request";

export const p2pMakerQuery = gql`
  query p2pMakerQuery($telegram_username: String) {
    p2PMakers(
      filters: {
        telegram_username: { eqi: $telegram_username }
        status: { in: ["active", "suspended", "disabled"] }
      }
    ) {
      data {
        id
        attributes {
          telegram_username
          telegram_name
          status
          telegram_chat_id
          createdAt
          p_2_p_offers {
            data {
              id
              attributes {
                side
                isActive
                course
                min
                max
                fee_type
                fee_amount
              }
            }
          }
          coordinates
          exchanger_tags {
            data {
              id
              attributes {
                name
                description
                color
              }
            }
          }
          avatar {
            data {
              id
              attributes {
                url
                alternativeText
              }
            }
          }
          description

          reviews(filters: { isApproved: { eq: true } }) {
            data {
              id
              attributes {
                fingerprint
                ipAddress
                name
                text
                type
                isDispute
                isClosed
                isApproved
                review_categories {
                  data {
                    id
                    attributes {
                      title
                      description
                      isNegative
                      image {
                        data {
                          id
                          attributes {
                            name
                            alternativeText
                            url
                          }
                        }
                      }
                    }
                  }
                }
                userAgent
                location
                updatedAt
                screenshots {
                  data {
                    id
                    attributes {
                      name
                      alternativeText
                      url
                    }
                  }
                }
                review_replies {
                  data {
                    id
                    attributes {
                      text
                      from
                      iaApproved
                      updatedAt
                      screenshots {
                        data {
                          id
                          attributes {
                            name
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
      }
    }
  }
`;
