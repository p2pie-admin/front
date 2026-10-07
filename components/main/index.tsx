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
import { IDirText } from "../../types/exchange";
import MassSelector from "./massSelectorSwiper";
import Advantages from "./advantages";
import CustomTitle from "../shared/CustomTitle";
import AllReviews from "./allReviews";
import { IExchangerReview } from "../../types/exchanger";
import GeneralStats from "./GeneralStats";
import PopularDirections from "./PopularDirections";

const MainPageContent = ({
  popularPms,
  popularRates,
  mainTexts,
  rootText,
  reviews,
}: {
  popularPms?: IPm[];
  popularRates?: IPopularDirRates;
  mainTexts?: IMainText[];
  rootText: IDirText;
  reviews?: IExchangerReview[] | null;
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
        <Column index={3}>
          <CircularTexts mainTexts={mainTexts} />
        </Column>
        <Column index={1}>
          <Calculator />
        </Column>
        <Column index={4}>
          <Box p="2">
            <ResponsiveText variant="contrast" whiteSpace="normal" size="lg">
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
      <Divider mt="4" />
      <GeneralStats />

      <CustomTitle
        as="h2"
        title={"Популярные направления"}
        subtitle={"Лучший курс по каждому направлению прямо сейчас"}
      />

      <PopularDirections popularRates={popularRates} popularPms={popularPms} />

      {/* The picker wheel stays on desktop only; on phones the cards above replace it. */}
      <Box display={{ base: "none", lg: "block" }} w="100%">
        <CustomTitle
          as="h2"
          title={"Поиск курсов"}
          subtitle={
            "Мы собираем данные с сотен обменников, чтобы выбрать лучший курс для Вас"
          }
        />
        <MassSelector />
      </Box>
      <CustomTitle
        as="h2"
        title={"Преимущества"}
        subtitle={"Работаем на репутацию, а не на прибыль"}
      />

      <Advantages />

      <CustomTitle
        fontSize={{ base: "xl", lg: "4xl" }}
        as="h2"
        mb="0"
        ml="8"
        title={"Репутация и доверие"}
        subtitle={"Свежие отзывы с p2pie, BestChange, KursExpert и других мониторингов"}
      />

      <AllReviews reviews={reviews} />
    </VStack>
  );
};

export default MainPageContent;
