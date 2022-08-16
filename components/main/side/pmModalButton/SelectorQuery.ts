import { gql } from "graphql-request";

export const selectorQuery = gql`
  
query Selector {
  selector {
    data {
			id
      attributes {
        en_give_header
        ru_give_header
        en_get_header
        ru_get_header
        search_bar{
          ru_placeholder
          en_placeholder
          ru_give_adornment
          en_give_adornment
          ru_get_adornment
          en_get_adornment
        }
        sections {
          id
          rows
          columns
          ru_title
          en_title        
          pm_groups(pagination: { start: 0, limit: 1000 }) {
            data {
              id
              attributes {
                en_name
                ru_name
                prefix
                options {
                  ... on ComponentSelectorSubgroup {
                    id
                		code
                    name
                    currency{
                       data{
                        id
                        attributes{
                          code
													accuracy
                        }
                      }
                    }              
                  }
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
                }
                icon{
                  data{
                    id
                    attributes{
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

`;
