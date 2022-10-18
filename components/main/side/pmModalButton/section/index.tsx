import React, { ReactChildren, useState } from "react";
// import PmGroup from "../PmGroup";
// import SectionGridWrapper from "./SectionGridWrapper";

import {
  Button,
  Text,
  Spacer,
  Collapse,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import Arrow from "../../../../shared/Arrow";
import SectionGridWrapper from "./SectionGrid";
import SectionHidden from "./SectionHidden";
import PmGroup from "./PmGroup";
import { PmGroupType } from "../../../../../types/selector";
// import SectionHidden from "./SectionHidden";

const Section = ({
  title,
  itemsToShow = 6,
  pmGroups,
}: {
  title: string;
  itemsToShow: number;
  pmGroups: PmGroupType[];
}) => {
  const [isHidden, setHidden] = useState(false);
  if (!pmGroups.length) return <></>;
  return (
    <>
      <Button
        position="sticky"
        top="0"
        zIndex="1"
        w="100%"
        mb="2"
        justifyContent="start"
        bgColor="bg.500"
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
        <SectionGridWrapper>
          {pmGroups.slice(0, itemsToShow).map((pm_group) => {
            return <PmGroup pm_group={pm_group} key={pm_group.en_name} />;
          })}
        </SectionGridWrapper>

        {pmGroups.length > itemsToShow && (
          <SectionHidden>{pmGroups.slice(itemsToShow)}</SectionHidden>
        )}
      </Collapse>
    </>
  );
};

export default Section;
