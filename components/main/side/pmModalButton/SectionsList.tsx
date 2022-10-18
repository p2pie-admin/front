import React from "react";
import { Box, VStack, useColorModeValue, SlideFade } from "@chakra-ui/react";
import Section from "./section";

// import ListFilter from "../../../ListFilter";
//const listFilter = new ListFilter();
//import { SectionContext } from "./section/SectionContext";
import { useTranslation } from "react-i18next";
import { useBreakpointValue } from "@chakra-ui/react";
import { SectionContext } from "./section/SectionContext";
import { SectionType } from "../../../../types/selector";

const SectionsList = ({ sections }: { sections: SectionType[] }) => {
  //   const list = [];
  //   const { i18n } = useTranslation();
  //const list = listFilter.filterJsonByString(inputFieldValue.value, pmsList);

  //console.log(sections && _findAllByKey(sections, "name"));

  return (
    <>
      <Box w="100%" borderRadius="lg" maxH="75vh">
        {/* {filterSections(sections).map((section, id) => ( */}
        {sections?.length &&
          sections.map((section, index) => (
            <SectionContext.Provider
              key={section.id}
              value={{
                columns: section.columns,
                currencyVisible:
                  section.en_title.toLowerCase().includes("crypto") ||
                  section.en_title.toLowerCase().includes("cash"),
              }}
            >
              <SlideFade in delay={index * 0.05}>
                <Section
                  key={section.id}
                  title={section[`en_title`]}
                  itemsToShow={section.columns * section.rows}
                  pmGroups={section.pm_groups}
                />
              </SlideFade>
            </SectionContext.Provider>
          ))}
      </Box>
    </>
  );
};

export default SectionsList;
