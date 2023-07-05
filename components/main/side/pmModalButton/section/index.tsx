import React, { ReactChildren, useEffect, useState } from "react";
// import PmGroup from "../PmGroup";
// import SectionGridWrapper from "./SectionGridWrapper";

import {
  Button,
  Text,
  Spacer,
  Collapse,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import Arrow from "../../../../shared/Arrow";
import SectionGridWrapper from "./SectionGrid";
import SectionHidden from "./SectionHidden";
import PmGroup from "./PmGroup";
import { IPmGroup } from "../../../../../types/selector";
import { Box3D } from "../../../../../styles/theme/wrappers";
import { useAppSelector } from "../../../../../redux/hooks";

const Section = ({
  title,
  itemsToShow = 6,
  pmGroups,
}: {
  title: string;
  itemsToShow: number;
  pmGroups: IPmGroup[];
}) => {
  const [isHidden, setHidden] = useState(false);

  // useEffect(() => {
  //   setTimeout(() => setHidden(false), 10);
  // }, []);
  const country = useAppSelector((state) =>
    state.main.location.en_country_name.toUpperCase()
  );
  const filteredPmGroups = pmGroups.filter(
    (pmGroup) =>
      !pmGroup.countries ||
      !pmGroup.countries.length ||
      pmGroup.countries.find((c) => c.toUpperCase() == country)
  );

  if (!filteredPmGroups.length) return <></>;
  return (
    <Box3D mb="4" position="relative">
      <Button
        position="sticky"
        top="-0.5"
        boxShadow="0 10px 15px -6px rgba(0,0,0,0.45)"
        borderBottomRadius={isHidden ? "2xl" : "0"}
        variant="extra_contrast"
        zIndex="1"
        w="100%"
        justifyContent="start"
        onClick={() =>
          // showSection({ ...foldedSections, [id]: !foldedSections[id] })
          setHidden(!isHidden)
        }
      >
        <Text fontSize="lg" color="bg.500">
          {title.toUpperCase()}
        </Text>
        <Spacer />
        <Arrow isUp={!isHidden} />
      </Button>

      <Collapse in={!isHidden} unmountOnExit>
        <Box p="2" pb="1" borderBottomRadius="2xl">
          <SectionGridWrapper>
            {filteredPmGroups.slice(0, itemsToShow).map((pm_group) => {
              return <PmGroup pm_group={pm_group} key={pm_group.en_name} />;
            })}
          </SectionGridWrapper>

          {filteredPmGroups.length > itemsToShow && (
            <SectionHidden>{filteredPmGroups.slice(itemsToShow)}</SectionHidden>
          )}
        </Box>
      </Collapse>
    </Box3D>
  );
};

export default Section;
