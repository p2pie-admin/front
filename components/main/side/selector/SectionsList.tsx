import React, { useEffect, useState } from "react";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import Section from "./section";

// import ListFilter from "../../../ListFilter";
//const listFilter = new ListFilter();
//import { SectionContext } from "./section/SectionContext";

import { SectionContext } from "../../../shared/contexts/SectionContext";
import { ISection } from "../../../../types/selector";
import { pickName, useLocale } from "../../../../services/i18n";

const SectionsList = ({ sections }: { sections: ISection[] }) => {
  //   const list = [];
  //   const { i18n } = useTranslation();
  //const list = listFilter.filterJsonByString(inputFieldValue.value, pmsList);
  const locale = useLocale();
  const isSmall = useBreakpointValue({
    base: true,
    md: false,
  });

  return (
    <Box w="100%" borderRadius="lg">
      {sections?.length &&
        sections.map((section, index) => (
          <SectionContext.Provider
            key={section.id}
            value={{
              columns: section.columns,
              currencyHidden: !(
                section.en_title.toLowerCase().includes("crypto") ||
                section.en_title.toLowerCase().includes("cash")
              ),
            }}
          >
            <Section
              key={section.id}
              title={pickName(section, locale, "title")}
              itemsToShow={
                isSmall
                  ? section.columns * 2 - 2
                  : section.columns * section.rows
              }
              pmGroups={section.pm_groups}
            />
          </SectionContext.Provider>
        ))}
    </Box>
  );
};

export default SectionsList;
