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
import PmName from "./PmName";
import PmButton from "./PmButton";
import React from "react";
import Arrow from "../../../../../shared/Arrow";
import { SubButton } from "./SubButton";
import { PmType } from "../../../../../../types/selector";
import { allPmsHaveUnmetPairs, singlePmHasUnmetPairs } from "./helper";

const Subitems = ({
  pmGroupName,
  pms,
  choosePm,
  possiblePairs,
}: {
  pmGroupName: string;
  pms: PmType[];
  choosePm: Function;
  possiblePairs?: string[];
}) => {
  const [folded, setFolded] = React.useState(false);

  return (
    // сама обложка раскрывалки
    <VStack>
      <PmButton
        icon={pms[0].icon}
        handleToggle={() => setFolded(!folded)}
        disabled={allPmsHaveUnmetPairs(pms, possiblePairs)}
      >
        <PmName
          name={pmGroupName}
          code={pms[0].currency.code.toUpperCase()} // только для крипты нужен код
        />
        <Spacer />
        <Arrow isUp={folded} />
      </PmButton>
      <Box w="100% !important" m="0 !important">
        <Collapse in={folded} unmountOnExit animateOpacity>
          <Box
            p="2"
            w="100% !important"
            bgColor="bg.700"
            borderRadius="lg"
            my="1"
          >
            <Grid templateColumns="1fr 1fr" gridGap="2" gridAutoFlow="dense">
              {pms.map((pm: PmType) => (
                <SubButton
                  pm={pm}
                  choosePm={choosePm}
                  key={pm.code}
                  disabled={singlePmHasUnmetPairs(pm, possiblePairs)}
                >
                  {pm.subgroup_name || pm.currency.code.toUpperCase()}
                </SubButton>
              ))}
            </Grid>
          </Box>
        </Collapse>
      </Box>
    </VStack>
  );
};

export default Subitems;
