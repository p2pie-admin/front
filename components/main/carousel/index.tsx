import React from "react";

import { useAppSelector } from "../../../redux/hooks";
import useSWR from "swr";
import {
  TopParametersQuery,
  DirectionParametersQuery,
  ExchangerParametersQuery,
} from "./queries";

import { IParam } from "../../../types/rates";

import ErrorWrapper from "../../shared/ErrorWrapper";
import initFetcher from "../../../services/graphql";
import { SearchOff } from "@styled-icons/material-outlined/SearchOff";
import {
  Box,
  Collapse,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import BottomPanel from "./bottom-panel";
import ExchangerCard from "./card";
import Swiper from "./swiper";
import { Box3D } from "../../../styles/theme/wrappers";

const fetcher = initFetcher();

interface IParamData {
  id: string;
  code: string;
  parameter: IParam;
  en_name?: string;
  ru_name?: string;
}

const Carousel = () => {
  //const pendingDirRates = useAppSelector((state) => state.main.pendingDirRates);

  const { data: topParametersData, error: topParameterError } = useSWR(
    TopParametersQuery,
    fetcher
  ) as {
    data: {
      topParameters: IParamData[];
    };
    error: boolean;
  };

  const {
    data: directionParametersData,
    error: directionParameterError,
  } = useSWR(DirectionParametersQuery, fetcher) as {
    data: {
      directionParameters: IParamData[];
    };
    error: boolean;
  };

  const {
    data: exchangerParametersData,
    error: exchangerParameterError,
  } = useSWR(DirectionParametersQuery, fetcher) as {
    data: {
      exchangerParameters: IParamData[];
    };
    error: boolean;
  };

  const bothPmsSelected = useAppSelector(
    (state) => !!state.main.givePm?.code && !!state.main.getPm?.code
  );

  const dirRates = useAppSelector((state) => state.main.dirRates);

  if (!bothPmsSelected) {
    return <></>;
  }

  const allParameters = [
    ...(topParametersData?.topParameters || []),
    ...(directionParametersData?.directionParameters || []),
    ...(exchangerParametersData?.exchangerParameters || []),
  ];

  console.log("allParameters", allParameters);
  // вынесен наружу, иначе все внутри ErrorWrapper начинает высчитываться и выдает ошибку
  return (
    <Box3D bgColor={useColorModeValue("bg.10", "bg.900")} mb="4" px="2" py="4">
      <Collapse in={dirRates && !!dirRates.length}>
        {dirRates && (
          <Swiper gap={12}>
            {dirRates.map((dirRate, index) => {
              // topsData?.tops.filter((t) =>
              //   dirRate?.tags?.find((tag) => tag === t.code)
              // ) || [];
              const parameters = allParameters
                .filter((p) =>
                  dirRate?.parameterCodes?.find((code) => code === p.code)
                )
                .map((p) => ({
                  ...p.parameter,
                  en_name: p.en_name,
                  ru_name: p.ru_name,
                }));
              // parametersData?.parameters.filter(
              //   (p) =>
              //     dirRate.param &&
              //     dirRate.param
              //       .split(",")
              //       .find((exchParam) => exchParam === p.code)
              // ) || [];
              return (
                <ExchangerCard
                  key={dirRate.exchangerId + index}
                  dirRate={dirRate}
                  parameters={parameters}
                />
              );
            })}
          </Swiper>
        )}

        <BottomPanel length={dirRates?.length || 0} />
      </Collapse>
    </Box3D>
  );
};

export default Carousel;

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
