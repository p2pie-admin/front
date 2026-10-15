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
import { useLocale, useT } from "../../services/i18n";

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
  const locale = useLocale();
  const t = useT();
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
          {/* The root text-box is a Russian-only CMS text: hidden on English pages. */}
          {locale === "en" ? null : (
            <Box p="2">
              <ResponsiveText variant="contrast" whiteSpace="normal" size="lg">
                {rootText?.header || ""}
              </ResponsiveText>
              <Divider my="2" />
              <ResponsiveText variant="no_contrast" whiteSpace="normal">
                {rootText?.text || ""}
              </ResponsiveText>
            </Box>
          )}
        </Column>
        <Column index={2}>
          <Popular popularRates={popularRates} popularPms={popularPms} />
        </Column>
      </ColumnGrid>
      <Divider mt="4" />
      <GeneralStats />

      <CustomTitle
        as="h2"
        title={t("Популярные направления", "Popular directions")}
        subtitle={t(
          "Лучший курс по каждому направлению прямо сейчас",
          "The best rate for each direction right now"
        )}
      />

      <PopularDirections popularRates={popularRates} popularPms={popularPms} />

      {/* The picker wheel stays on desktop only; on phones the cards above replace it. */}
      <Box display={{ base: "none", lg: "block" }} w="100%">
        <CustomTitle
          as="h2"
          title={t("Поиск курсов", "Rate search")}
          subtitle={t(
            "Мы собираем данные с сотен обменников, чтобы выбрать лучший курс для Вас",
            "We collect data from hundreds of exchangers to find the best rate for you"
          )}
        />
        <MassSelector />
      </Box>
      <CustomTitle
        as="h2"
        title={t("Преимущества", "Advantages")}
        subtitle={t(
          "Работаем на репутацию, а не на прибыль",
          "We work for reputation, not for profit"
        )}
      />

      <Advantages />

      <CustomTitle
        fontSize={{ base: "xl", lg: "4xl" }}
        as="h2"
        mb="0"
        ml="8"
        title={t("Репутация и доверие", "Reputation and trust")}
        subtitle={t(
          "Свежие отзывы с p2pie, BestChange, KursExpert и других мониторингов",
          "Fresh reviews from p2pie, BestChange, KursExpert and other monitoring sites"
        )}
      />

      <AllReviews reviews={reviews} />
    </VStack>
  );
};

export default MainPageContent;
