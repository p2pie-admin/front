import { Box, HStack } from "@chakra-ui/react";
import { ResponsiveText } from "../../../styles/theme/custom";
import useSWR from "swr";
import ErrorWrapper from "../../../components/shared/ErrorWrapper";
import { initCMSFetcher } from "../../../services/fetchers";
import { RegulationsQuery } from "./queries";
import { IP2PRegulationGroup } from "../../../types/p2p";
import RegulationGroup from "./RegulationGroup";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useEffect } from "react";
import { initRegulationGroups } from "../../../redux/mainReducer";
import MultipleCitiesContext from "../../../components/layout/header/nav/location/MultipleCitiesContext";
import Location from "../../../components/layout/header/nav/location";

const Step2 = () => {
  const fetcher = initCMSFetcher();
  const dispatch = useAppDispatch();
  const { data, error } = useSWR(RegulationsQuery, fetcher) as {
    data: {
      regulationGroups: any;
    };
    error: boolean;
  };

  const fetchedRegGroups = data?.regulationGroups as IP2PRegulationGroup[];
  // const regulationGroups = useAppSelector(
  //   (state) => state.main.regulationGroups
  // );

  useEffect(() => {
    fetchedRegGroups && dispatch(initRegulationGroups(fetchedRegGroups));
  }, [fetchedRegGroups]);

  return (
    <ErrorWrapper isError={!!error} isLoading={!fetchedRegGroups}>
      <Box>
        {fetchedRegGroups &&
          fetchedRegGroups.map((regulationGroup) => (
            <RegulationGroup regulationGroup={regulationGroup} />
          ))}
      </Box>

      <MultipleCitiesContext.Provider value={true}>
        <Location />
      </MultipleCitiesContext.Provider>
    </ErrorWrapper>
  );
};

export default Step2;
