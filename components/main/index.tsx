import React, { useEffect } from "react";
import { VStack } from "@chakra-ui/react";
import Greeting from "./Greeting";
import Calculator from "./Calculator";
import { useAppDispatch } from "../../redux/hooks";
import { clean } from "../../redux/mainReducer";
import { useRouter } from "next/router";
import ColumnGrid from "../layout/ColumnGrid";
import ColumnHeader from "../layout/ColumnHeader";
import Column from "../layout/Column";
import { ResponsiveText } from "../../styles/theme/custom";
import { IMainText, ITextBox } from "../../types/pages";
import { IPopularDirRates } from "../../types/rates";
import { IPm } from "../../types/selector";
import CircularTexts from "./CircularTexts";
import Popular from "./popular";

const MainPageContent = ({
  popularPms,
  popularRates,
  mainTexts,
  rootText,
  locale,
}: {
  popularPms?: IPm[];
  popularRates?: IPopularDirRates;
  mainTexts?: IMainText[];
  rootText: ITextBox;
  locale: "en" | "ru";
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { slug } = router.query;

  useEffect(() => {
    if (!slug) {
      dispatch(clean());
    }
  }, [slug]);

  return (
    <VStack>
      <Greeting />
      <ColumnGrid>
        <Column index={2}>
          <CircularTexts mainTexts={mainTexts} />
        </Column>
        <Column index={1}>
          <ColumnHeader
            text="Что отдаем, что получаем?"
            query={["отдаем", "получаем"]}
          />
          <Calculator />
        </Column>
        <Column index={4}>
          <ColumnHeader text={rootText?.title} />
          <ResponsiveText variant="contrast">
            {rootText?.subtitle || ""}
          </ResponsiveText>
          <ResponsiveText variant="no_contrast" whiteSpace="normal">
            {rootText?.text || ""}
          </ResponsiveText>
        </Column>
        <Column index={3}>
          <ColumnHeader text="Популярные курсы обмена" as="h3" />
          <Popular popularRates={popularRates} popularPms={popularPms} />
        </Column>
      </ColumnGrid>
    </VStack>
  );
};

export default MainPageContent;
