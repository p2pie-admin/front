import { gql } from "graphql-request";

export const p2pMakersQuery = gql`
  query p2pMakersQuery {
    p2PMakers(
      filters: { status: { in: ["active", "suspended", "disabled"] } }
    ) {
      data {
        id
        attributes {
          slug
          telegram_name
          telegram_username
          status
          createdAt
          offers {
            data {
              id
              attributes {
                side
                dir
                isActive
                course
                min
                max
                fee_type
                fee_amount
                city_from
                city_to
              }
            }
          }

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

          reviews(filters: { isApproved: { eq: true } }) {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

export const p2pMakerQuery = gql`
  query p2pMakerQuery($slug: String) {
    p2PMakers(
      filters: {
        slug: { eqi: $slug }
        status: { in: ["active", "suspended", "disabled"] }
      }
    ) {
      data {
        id
        attributes {
          slug
          telegram_name
          telegram_username
          deals_finished
          deals_canceled
          rating
          need_ai_helper
          deposit_usd
          status
          createdAt
          offers {
            data {
              id
              attributes {
                side
                dir
                isActive
                course
                min
                max
                fee_type
                fee_amount
                city_from
                city_to
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

export const testReviewQuery = gql`
  query TestReviewQuery {
    reviews(filters: { fingerprint: { eq: "test" } }) {
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
          userAgent
          location
          updatedAt
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
`;
