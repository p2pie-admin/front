import React, { ReactChildren, useEffect, useState } from "react";
// import PmGroup from "../PmGroup";
// import SectionGridWrapper from "./SectionGridWrapper";

import { Button, Text, Spacer, Collapse, Box } from "@chakra-ui/react";
import Arrow from "../../../../shared/Arrow";
import SectionGridWrapper from "./SectionGrid";
import SectionHidden from "./SectionHidden";
import PmGroup from "./PmGroup";
import { IPmGroup } from "../../../../../types/selector";

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

  if (!pmGroups.length) return <></>;
  return (
    <Box mb="4" position="relative">
      <Button
        position="sticky"
        top="-0.5"
        bgColor="bg.1000"
        boxShadow="0 10px 15px -6px rgba(0,0,0,0.75)"
        borderBottomRadius={isHidden ? "2xl" : "0"}
        variant="default"
        zIndex="1"
        w="100%"
        justifyContent="start"
        onClick={() =>
          // showSection({ ...foldedSections, [id]: !foldedSections[id] })
          setHidden(!isHidden)
        }
      >
        <Text fontSize="lg" color="bg.100">
          {title.toUpperCase()}
        </Text>
        <Spacer />
        <Arrow isUp={!isHidden} />
      </Button>

      <Collapse in={!isHidden} unmountOnExit>
        <Box p="2" pb="1" borderBottomRadius="2xl" bgColor="bg.900">
          <SectionGridWrapper>
            {pmGroups.slice(0, itemsToShow).map((pm_group) => {
              return <PmGroup pm_group={pm_group} key={pm_group.en_name} />;
            })}
          </SectionGridWrapper>

          {pmGroups.length > itemsToShow && (
            <SectionHidden>{pmGroups.slice(itemsToShow)}</SectionHidden>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default Section;
