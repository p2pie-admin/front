import { gql } from "graphql-request";

export const popularQuery = gql`
  {
    popularDirs {
      data {
        id
        attributes {
          groups {
            ... on ComponentPopularPopularGroup {
              id
              icon {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
              en_name
              ru_name
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
                            ... on ComponentSelectorCurrency {
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
                }
              }
            }
          }
        }
      }
    }
  }
`;
