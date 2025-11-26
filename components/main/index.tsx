import React, { useEffect } from "react";
import { VStack, Text, Box, Divider } from "@chakra-ui/react";
import Greeting from "./Greeting";
import Calculator from "./Calculator";
import { useAppDispatch } from "../../redux/hooks";
import { clean } from "../../redux/mainReducer";
import { useRouter } from "next/router";
import ColumnGrid from "../layout/ColumnGrid";
import ColumnHeader from "../layout/ColumnHeader";
import Column from "../layout/Column";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import { IMainText } from "../../types/pages";
import { IPopularDirRates } from "../../types/rates";
import { IPm } from "../../types/selector";
import CircularTexts from "./CircularTexts";
import Popular from "./popular";
import { useTranslation } from "next-i18next";
import { IDirText } from "../../types/exchange";
import MassSelector from "../mass/massSelectorSwiper";

const MainPageContent = ({
  popularPms,
  popularRates,
  mainTexts,
  rootText,
}: {
  popularPms?: IPm[];
  popularRates?: IPopularDirRates;
  mainTexts?: IMainText[];
  rootText: IDirText;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { slug } = router.query;

  // mylog("popularPms.length", popularPms?.length);
  // mylog("popularPmCodes.length", mainTexts?.length);
  // mylog("pms.length", rootText);

  useEffect(() => {
    if (!slug) {
      dispatch(clean());
    }
  }, [slug]);

  return (
    <VStack>
      <Greeting />

      <ColumnGrid>
        <Column index={3}>
          <CircularTexts mainTexts={mainTexts} />
        </Column>
        <Column index={1}>
          <Calculator />
        </Column>
        <Column index={4}>
          <Box p="2">
            <ResponsiveText variant="contrast" whiteSpace="normal">
              {rootText?.header || ""}
            </ResponsiveText>
            <Divider my="2" />
            <ResponsiveText variant="no_contrast" whiteSpace="normal">
              {rootText?.text || ""}
            </ResponsiveText>
          </Box>
        </Column>
        <Column index={2}>
          <Popular popularRates={popularRates} popularPms={popularPms} />
        </Column>
      </ColumnGrid>

      <VStack my="10" mx="4">
        <ResponsiveText
          as="h2"
          fontSize="4xl"
          fontWeight="bold"
          variant="primary"
          textAlign="center"
          whiteSpace="unset"
        >
          {rootText?.header}
        </ResponsiveText>
        <ResponsiveText
          as="h3"
          fontSize="2xl"
          variant="no_contrast"
          textAlign="center"
          whiteSpace="unset"
        >
          {rootText?.subheader}
        </ResponsiveText>
      </VStack>
      <MassSelector />
    </VStack>
  );
};

export default MainPageContent;
