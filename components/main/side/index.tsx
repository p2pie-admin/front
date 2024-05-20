import {
  useColorModeValue,
  Grid,
  Box,
  Divider,
  Text,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { Box3D, ResponsiveText } from "../../../styles/theme/custom";
import { IPm } from "../../../types/selector";
import AmountInput from "./amountInput";
import PmModalButton from "./pmModalButton";
import { useContext } from "react";
import SideContext from "../../shared/contexts/SideContext";
import { capitalize } from "./selector/section/PmGroup/helper";
import { useAppSelector } from "../../../redux/hooks";

const Side = () => {
  const side = useContext(SideContext) as "give" | "get";
  const isEmpty = useAppSelector((state) => !state.main[`${side}Pm`]?.code);
  return (
    <Box3D>
      <Grid
        gridTemplateRows="1fr 36px 1fr"
        gridTemplateColumns="auto 1fr"
        alignItems="center"
        px={["2", "4"]}
        py={["0.5", "1"]}
        gridAutoFlow=""
      >
        {isEmpty ? (
          <Box />
        ) : (
          <Text color="bg.500" fontSize="xs">
            {capitalize(side) + ":"}
          </Text>
        )}
        <Box />
        <PmModalButton />

        <AmountInput />
      </Grid>
    </Box3D>
  );
};

export default Side;
