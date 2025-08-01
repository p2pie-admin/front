import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import useSWR from "swr";

import ErrorWrapper from "../../shared/ErrorWrapper";

import { Box, HStack, Link } from "@chakra-ui/react";
import { IParameter, IRate } from "../../../types/rates";
import Swiper from "./Swiper";
import { useIsMobile } from "./hooks";
import { fetchDirRates, fetchTopParameters } from "../../../redux/thunks";
import CustomModal from "../../shared/CustomModal";
import RateDetails from "../../shared/RateDetails";
import { useRouter } from "next/router";
import { ICity } from "../../../types/exchange";
import NextLink from "next/link";
import { slugCityToExchange } from "../../exchange/helper";
import { capitalize } from "../side/selector/section/PmGroup/helper";
import { ResponsiveText } from "../../../styles/theme/custom";
import { useTranslation } from "react-i18next";

const TV = ({
  dir,
  city,
  donorCity,
  slug,
}: {
  dir: string;
  city: ICity | null;
  donorCity: ICity | null;
  slug: string;
}) => {
  const [initial, setInitial] = useState(true);
  const router = useRouter();
  const { t } = useTranslation();
  const { locale } = router as { locale: "en" | "ru" };
  const { exchange } = router.query as { exchange: string };
  const dirRatesStatus = useAppSelector((state) => state.main.dirRatesStatus);
  const dirRates = useAppSelector((state) => state.main.dirRates) || [];
  // const cityName = useAppSelector((state) => state.main.city.en_name);
  const isCash =
    (exchange && exchange.startsWith("cash-")) || exchange.includes("-cash-");

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      fetchDirRates({ dir, cityName: city && isCash ? city.en_name : "" })
    );
  }, [dir, city]);

  useEffect(() => {
    dispatch(fetchTopParameters());
    setInitial(false);
  }, []);

  const isMobile = useIsMobile();
  const itemHeight = isMobile ? 100 : 130; // Height of each text box
  const visibleItems = 3; // Number of items visible in the container
  const containerHeight = itemHeight * visibleItems;

  const props = {
    isMobile,
    itemHeight,
    visibleItems,
    containerHeight,
    dirRates,
  };

  const isError =
    dirRatesStatus === "rejected" || (!initial && !dirRates.length);
  const isLoading = dirRatesStatus === "pending";

  return (
    <Box minH={`${itemHeight * visibleItems}`}>
      <CustomModal id="rate-details" header="Exchanger details">
        <RateDetails />
      </CustomModal>
      <ErrorWrapper
        isError={isError}
        isLoading={isLoading}
        primaryMessage="No rates available!"
        secondaryMessage="check your network connection"
      >
        <Swiper {...props} />
      </ErrorWrapper>
      {!isLoading && isError && donorCity && (
        <HStack justifyContent="center">
          <ResponsiveText fontSize="2xl" variant="primary">
            {t("main:closest_cities")}{" "}
            {city?.closest_cities.map((c, index) => (
              <Link
                as={NextLink}
                href={`/${slugCityToExchange(slug, c.en_name)}`}
                fontWeight="bold"
              >
                {`${index ? "," : ""} ${capitalize(c[`${locale}_name`])}`}
              </Link>
            ))}
          </ResponsiveText>
        </HStack>
      )}
    </Box>
  );
};

export default TV;
// const { data: topParametersData, error: topParameterError } = useSWR(
//   TopTopParametersQuery,
//   fetcher
// ) as {
//   data: {
//     topParameters: IParamData[];
//   };
//   error: boolean;
// };

// const { data: directionParametersData, error: directionParameterError } =
//   useSWR(DirectionTopParametersQuery, fetcher) as {
//     data: {
//       directionParameters: IParamData[];
//     };
//     error: boolean;
//   };

// const { data: exchangerParametersData, error: exchangerParameterError } =
//   useSWR(DirectionTopParametersQuery, fetcher) as {
//     data: {
//       exchangerParameters: IParamData[];
//     };
//     error: boolean;
//   };

// const allParameters = [
//   ...(topParametersData?.topParameters || []),
//   ...(directionParametersData?.directionParameters || []),
//   ...(exchangerParametersData?.exchangerParameters || []),
// ];
