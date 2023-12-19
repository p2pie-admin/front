import _ from "lodash";
import {
  Button,
  Flex,
  Collapse,
  Spacer,
  Grid,
  Box,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import Name from "./Name";
import PmButton from ".";
import React from "react";
import Arrow from "../../../../../shared/Arrow";
import { SubButton } from "./SubButton";
import { IPm } from "../../../../../../types/selector";
import { allPmsHaveUnmetPairs, singlePmHasUnmetPairs } from "./helper";

const Subitems = ({
  pmGroupName,
  pms,
  choosePm,
  possiblePairs,
  color,
}: {
  pmGroupName: string;
  pms: IPm[];
  choosePm: Function;
  possiblePairs?: string[];
  color: string;
}) => {
  const [folded, setFolded] = React.useState(false);

  return (
    // сама обложка раскрывалки
    <VStack>
      <PmButton
        color={color}
        icon={pms[0].icon}
        handleToggle={() => setFolded(!folded)}
        shaded={allPmsHaveUnmetPairs(pms, possiblePairs)}
      >
        <Name
          name={pmGroupName}
          code={pms[0].currency.code.toUpperCase()} // только для крипты нужен код
        />
        <Spacer />
        <Arrow isUp={folded} />
        <Spacer />
      </PmButton>

      <Collapse in={folded}>
        <Box p="2" w="100% !important" my="1">
          <Grid templateColumns="1fr 1fr" gridGap="2" gridAutoFlow="dense">
            {pms.map((pm: IPm) => (
              <SubButton
                pm={pm}
                choosePm={choosePm}
                key={pm.code}
                shaded={singlePmHasUnmetPairs(pm, possiblePairs)}
              >
                {pm.subgroup_name || pm.currency.code.toUpperCase()}
              </SubButton>
            ))}
          </Grid>
        </Box>
      </Collapse>
    </VStack>
  );
};

export default Subitems;
