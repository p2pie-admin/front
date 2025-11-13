import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { CityCashSection, MapHeadings } from "../types";
import { BoxWrapper } from "../../shared/BoxWrapper";
import Dir from "../../exchange/Dir";

type CashDirectionsProps = {
  sections: CityCashSection[];
  headings: MapHeadings;
};

const CashDirections = ({ sections, headings }: CashDirectionsProps) => {
  if (!sections.length) return null;

  return (
    <>
      <Heading as="h3" size="md" color="bg.200">
        {headings.directionsTitle}
      </Heading>
      <VStack align="stretch" spacing="4">
        {sections.map((section) => (
          <BoxWrapper
            key={section.currencyCode}
            variant="contrast"
            w="full"
            my={0}
          >
            <VStack align="stretch" spacing="4">
              {section.buy.length > 0 && (
                <Box>
                  <Heading as="h4" size="sm" mb="3" color="bg.200">
                    {section.buyTitle}
                  </Heading>
                  <VStack align="stretch" spacing="3">
                    {section.buy.map((entry) => (
                      <Dir
                        key={entry.slug}
                        slug={entry.slug}
                        givePm={section.cashPm}
                        getPm={entry.cryptoPm}
                      >
                        <Text
                          mt="2"
                          textAlign="right"
                          color="bg.300"
                          fontWeight="semibold"
                        >
                          {entry.count}
                        </Text>
                      </Dir>
                    ))}
                  </VStack>
                </Box>
              )}

              {section.sell.length > 0 && (
                <Box>
                  <Heading as="h4" size="sm" mb="3" color="bg.200">
                    {section.sellTitle}
                  </Heading>
                  <VStack align="stretch" spacing="3">
                    {section.sell.map((entry) => (
                      <Dir
                        key={entry.slug}
                        slug={entry.slug}
                        givePm={entry.cryptoPm}
                        getPm={section.cashPm}
                      >
                        <Text
                          mt="2"
                          textAlign="right"
                          color="bg.300"
                          fontWeight="semibold"
                        >
                          {entry.count}
                        </Text>
                      </Dir>
                    ))}
                  </VStack>
                </Box>
              )}
            </VStack>
          </BoxWrapper>
        ))}
      </VStack>
    </>
  );
};

export default CashDirections;
