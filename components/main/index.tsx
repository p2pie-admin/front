import React, { useEffect, useState } from "react";
import { Box, Text, Center, VStack } from "@chakra-ui/react";
import Greeting from "./Greeting";
import Calculator from "./Calculator";
import Popular from "./Popular";
import { useAppDispatch } from "../../redux/hooks";
import { clean } from "../../redux/mainReducer";
import { useRouter } from "next/router";
import ColumnGrid from "../layout/ColumnGrid";
import ColumnHeader from "../layout/ColumnHeader";
import Column from "../layout/Column";
import { Box3D } from "../../styles/theme/custom";
import Shader from "../shared/Shader";
import { IMainText } from "../../types/pages";
import { IPopularDirRates } from "../../types/rates";
import { IPm } from "../../types/selector";
import CircularTexts from "./CircularTexts";

const MainPageContent = ({
  popularPms,
  popularRates,
  mainTexts,
  locale,
}: {
  popularPms?: IPm[];
  popularRates?: IPopularDirRates;
  mainTexts?: IMainText[];
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
        <Column index={0}>
          <CircularTexts mainTexts={mainTexts} />
        </Column>
        <Column index={1}>
          <ColumnHeader
            text="Что отдаем, что получаем?"
            as="h3"
            query={["отдаем", "получаем"]}
          />
          <Calculator />
        </Column>
        <Box3D
          p="4"
          variant="contrast"
          gridColumn={{ base: "unset", lg: "1/3" }}
          gridRow={{ base: "3", lg: "2" }}
        >
          <Popular popularRates={popularRates} popularPms={popularPms} />
        </Box3D>

        <Box3D
          p="4"
          variant="contrast"
          gridColumn={{ base: "unset", lg: "1/3" }}
          gridRow={{ base: "4", lg: "3" }}
        >
          <Text fontSize="2xl">Мониторинг обменников p2pie</Text>
          <Text color="bg.300">
            Мониторинг обменников разработан для тех, кто обменивает электронные
            деньги в Интернете, и для тех, кто хочет осуществлять
            гарантированные обмены с минимальными потерями на комиссиях обменных
            пунктов.
          </Text>
          <Text fontSize="2xl" mt="4">
            Наиболее выгодные обменные курсы
          </Text>
          <Text color="bg.300">
            Ниже в таблице вы найдете информацию о самых лучших курсах обмена по
            20-ти популярным направлениям. чтобы получить полный список обменных
            пунктов по какому-то конкретному направлению.
          </Text>
        </Box3D>
      </ColumnGrid>
    </VStack>
  );
};

export default MainPageContent;
