import React from "react";
import { useAppSelector } from "../../../redux/hooks";
import useSWR from "swr";
import { TopParametersQuery, DirectionParametersQuery } from "./queries";
import ErrorWrapper from "../../shared/ErrorWrapper";
import { initCMSFetcher } from "../../../services/fetchers";
import { Box } from "@chakra-ui/react";
import { IParamData, IRate } from "../../../types/rates";
import Swiper from "./swiper";

const fetcher = initCMSFetcher();

const TV = ({ isMobile }: { isMobile: boolean }) => {
  const { data: topParametersData, error: topParameterError } = useSWR(
    TopParametersQuery,
    fetcher
  ) as {
    data: {
      topParameters: IParamData[];
    };
    error: boolean;
  };

  const { data: directionParametersData, error: directionParameterError } =
    useSWR(DirectionParametersQuery, fetcher) as {
      data: {
        directionParameters: IParamData[];
      };
      error: boolean;
    };

  const { data: exchangerParametersData, error: exchangerParameterError } =
    useSWR(DirectionParametersQuery, fetcher) as {
      data: {
        exchangerParameters: IParamData[];
      };
      error: boolean;
    };

  const dirRatesStatus = useAppSelector((state) => state.main.dirRatesStatus);

  const allParameters = [
    ...(topParametersData?.topParameters || []),
    ...(directionParametersData?.directionParameters || []),
    ...(exchangerParametersData?.exchangerParameters || []),
  ];

  // вынесен наружу, иначе все внутри ErrorWrapper начинает высчитываться и выдает ошибку
  const length = useAppSelector((state) => state.main.dirRates?.length) || 0;
  return <Swiper length={length} isMobile={isMobile} />;
};

export default TV;

// <ErrorWrapper
// mainColor="red"
// iconColor="yellow"
// primaryMessage="Connection error!"
// secondaryMessage="Rates parser connection is lost!"
// linkMessage="report"
// isError={error}
// isLoading={!data || pendingDirRates}
// >
// <ErrorWrapper
//   mainColor="bg"
//   iconColor="bg"
//   isError={dirParserRespEmpty}
//   icon={SearchOff}
//   primaryMessage="No results!"
//   secondaryMessage="no rates were found for this direction"
//   linkMessage="report"
// >
