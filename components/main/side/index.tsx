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
  return (
    <Box3D>
      <Grid
        gridTemplateRows="1fr 36px"
        gridTemplateColumns="auto 1fr"
        alignItems="center"
        px={["2", "4"]}
        gridAutoFlow=""
      >
        <Box>
          <ResponsiveText color="bg.500" fontSize="xs" mt="2">
            {t(`main:${side}Title`)}
          </ResponsiveText>

          <PmModalButton />
        </Box>

        <AmountInput />
      </Grid>
    </Box3D>
  );
};

export default Side;
