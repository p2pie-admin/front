import {
  useColorModeValue,
  Grid,
  Box,
  Divider,
  Text,
  Flex,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { Box3D, ResponsiveText } from "../../../styles/theme/custom";
import { IPm } from "../../../types/selector";
import AmountInput from "./amountInput";
import PmModalButton from "./pmModalButton";
import { useContext } from "react";
import SideContext from "../../shared/contexts/SideContext";
import { capitalize } from "./selector/section/PmGroup/helper";
import { useAppSelector } from "../../../redux/hooks";
import { useTranslation } from "next-i18next";

const Side = () => {
  const side = useContext(SideContext) as "give" | "get";
  const { t } = useTranslation();
  const pmName = useAppSelector((state) => {
    const pm = state.main?.[`${side}Pm`];
    if (!pm) return;
    return `${pm?.ru_name || pm?.en_name} ${
      pm?.subgroup_name || pm?.currency.code
    }`;
  });
  return (
    <Box3D>
      {/* <Grid
        gridTemplateRows="1fr 30px 1fr"
        gridTemplateColumns="auto 1fr"
        alignItems="center"
        px={["2", "4"]}
        gridAutoFlow=""
        h="92px"
      > */}

      <VStack position="relative" alignItems="start">
        <Box h="20px" />
        <Text color="bg.600" fontSize="sm" position="absolute" top="1" left="4">
          {t(`main:${side}Title`)}
        </Text>
        <HStack
          justifyContent="space-between"
          h="30px"
          px="2"
          alignItems="center"
        >
          <PmModalButton />

          <AmountInput />
        </HStack>
        <Box h="20px" />
        {pmName && (
          <Text
            color="bg.400"
            fontSize="sm"
            position="absolute"
            bottom="1"
            left="4"
          >
            {capitalize(pmName)}
          </Text>
        )}
      </VStack>

      {/*     
      </Grid> */}
    </Box3D>
  );
};

export default Side;
