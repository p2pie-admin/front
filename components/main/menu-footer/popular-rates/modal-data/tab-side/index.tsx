import { Box, Text } from "@chakra-ui/react";
import { useContext } from "react";
import useSWR from "swr";

import { useAppSelector } from "../../../../../../redux/hooks";
import { initParserFetcher } from "../../../../../../services/fetchers";
import { Box3D } from "../../../../../../styles/theme/custom";
import { IPopularRate } from "../../../../../../types/rates";
import ErrorWrapper from "../../../../../shared/ErrorWrapper";
import SideContext from "../../../../../shared/contexts/SideContext";
import RateLayer from "./RateLayer";

const fetcher = initParserFetcher();
const TabSide = () => {
  const side = useContext(SideContext) as "buy" | "sell";

  const { data, error } = useSWR("popular_rates", fetcher);
  const popularRates = data
    ? Object.entries(data).map(([code, rate]) => [code, rate?.[side]])
    : [];

  return (
    <ErrorWrapper isError={error} isLoading={!data}>
      {popularRates.map((ratePair) => (
        <RateLayer
          code={ratePair[0] as string}
          rates={ratePair[1] as IPopularRate[]}
        />
      ))}
    </ErrorWrapper>
  );
};

export default TabSide;
