import React, { useEffect } from "react";
import {
  VStack,
  Text,
  Box,
  Divider,
  Heading,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";
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
import Advantages from "./advantages";

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

  const [peripheryColor, centerColor] = useToken(
    "colors",
    useColorModeValue(["bg.500", "violet.700"], ["bg.200", "peach.300"])
  );

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

      <Box
        my="20"
        bgGradient={`radial-gradient(circle at 50% -10%, ${centerColor} 10%, ${peripheryColor} 70%)`}
        bgClip="text"
      >
        <Heading
          as="h2"
          fontWeight="bold"
          color="inherit"
          fontSize={{ base: "3xl", md: "5xl" }}
          textAlign={"center"}
        >
          Преимущества
        </Heading>
        <Heading
          as="p"
          textAlign="center"
          fontSize={{ base: "lg", md: "xl" }}
          mt={2}
          color="bg.400"
          fontWeight="light"
        >
          Все просто: мы работаем на репутацию, а не на прибыль
        </Heading>
      </Box>
      <Advantages />

      <Box
        my="20"
        bgGradient={`radial-gradient(circle at 50% -10%, ${centerColor} 10%, ${peripheryColor} 70%)`}
        bgClip="text"
      >
        <Heading
          as="h2"
          fontWeight="bold"
          color="inherit"
          fontSize={{ base: "3xl", md: "5xl" }}
          textAlign={"center"}
        >
          Поиск курсов
        </Heading>
        <Heading
          as="p"
          textAlign="center"
          fontSize={{ base: "lg", md: "xl" }}
          mt={2}
          color="bg.400"
          fontWeight="light"
        >
          Мы собираем данные с сотен обменников, чтобы выбрать лучший курс для
          Вас
        </Heading>
      </Box>

      <MassSelector />
    </VStack>
  );
};

export default MainPageContent;
