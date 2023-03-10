import React, { ReactChildren, useContext, useEffect } from "react";

import { withTranslation } from "react-i18next";
import {
  Grid,
  Button,
  Text,
  Box,
  Collapse,
  useColorModeValue,
} from "@chakra-ui/react";
import Arrow from "../../../../shared/Arrow";
import SectionGridWrapper from "./SectionGrid";
import PmGroup from "./PmGroup";
import { IPmGroup } from "../../../../../types/selector";

const SectionHidden = ({ children }: { children: IPmGroup[] }) => {
  const dividerColor = useColorModeValue(
    "rgba(0,0,0,0.1)",
    "rgba(225,200,255,0.1)"
  );
  // const [foldedSections, showSection] = React.useState({});
  const [isHidden, setHidden] = React.useState(true);

  return (
    <Box mt="1">
      <Collapse in={!isHidden} unmountOnExit>
        <SectionGridWrapper>
          {children.map((pm_group) => {
            return <PmGroup pm_group={pm_group} key={pm_group.en_name} />;
          })}
        </SectionGridWrapper>
      </Collapse>
      {isHidden && (
        <Box
          w="100%"
          h="1px"
          background={`linear-gradient(to right, rgba(0,0,0,0) 10%, ${dividerColor} 30%, ${dividerColor} 70%, rgba(0,0,0,0) 90%)`}
        />
      )}
      <Button // see all
        maxH="6"
        w="100%"
        variant="default"
        justifyContent="center"
        onClick={() => setHidden(!isHidden)}
        color="bg.200"
      >
        <Text fontSize="md" m="0 2px">
          {isHidden ? "see all" : "fold"}
        </Text>
        <Arrow isUp={!isHidden} />
      </Button>
    </Box>
  );
};

export default SectionHidden;
