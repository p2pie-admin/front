import { Box, HStack } from "@chakra-ui/react";
import { ResponsiveText } from "../../../styles/theme/custom";
import useSWR from "swr";
import ErrorWrapper from "../../../components/shared/ErrorWrapper";
import { initCMSFetcher } from "../../../services/fetchers";
import { RegulationsQuery } from "./queries";
import { IP2PRegulationGroup } from "../../../types/p2p";
import RegulationGroup from "./RegulationGroup";
import MultipleCitiesContext from "../../layout/header/citySelector/location/MultipleCitiesContext";
import Location from "../../layout/header/citySelector/location";
import { useAppDispatch } from "../../../redux/hooks";
import { useEffect } from "react";
import { initDefaultRegulationCodes } from "../../../redux/mainReducer";

const Step2 = () => {
  const dispatch = useAppDispatch();
  const fetcher = initCMSFetcher();

  const { data, error } = useSWR(RegulationsQuery, fetcher) as {
    data: {
      regulationGroups: any;
    };
    error: boolean;
  };

  const fetchedRegGroups = data?.regulationGroups as IP2PRegulationGroup[];

  useEffect(() => {
    // забираем первичные дефолтные параметры если нет из localStorage
    if (fetchedRegGroups?.length) {
      dispatch(initDefaultRegulationCodes(fetchedRegGroups));
    }
  }, [fetchedRegGroups]);

  return (
    <ErrorWrapper isError={!!error} isLoading={!fetchedRegGroups}>
      <Box mt="2">
        <MultipleCitiesContext.Provider value={true}>
          <Location />
        </MultipleCitiesContext.Provider>
        {fetchedRegGroups &&
          fetchedRegGroups.map((regulationGroup) => (
            <RegulationGroup
              key={regulationGroup.id}
              regulationGroup={regulationGroup}
            />
          ))}
      </Box>
    </ErrorWrapper>
  );
};

export default Step2;
