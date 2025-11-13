import { Divider, VStack, Text, Box } from "@chakra-ui/react";

import { IoMdInformationCircle } from "react-icons/io";
import { CityCashSection, MapHeadings } from "../types";
import SectionEntries from "./SectionEntries";

type CashDirectionsProps = {
  sections: CityCashSection[];
  headings: MapHeadings;
};

const CashDirections = ({ sections, headings }: CashDirectionsProps) => {
  if (!sections.length) return null;

  return (
    <>
      <VStack align="stretch" spacing="4">
        {sections.map((section) => (
          <Box key={section.currencyCode}>
            <VStack align="stretch" spacing="4">
              {section.buy.length > 0 && (
                <SectionEntries
                  title={section.buyTitle}
                  entries={section.buy}
                  cashPm={section.cashPm}
                  direction="buy"
                />
              )}
              {section.sell.length > 0 && (
                <SectionEntries
                  title={section.sellTitle}
                  entries={section.sell}
                  cashPm={section.cashPm}
                  direction="sell"
                />
              )}
            </VStack>
          </Box>
        ))}
      </VStack>
    </>
  );
};

export default CashDirections;
