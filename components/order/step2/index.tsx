import { Box, HStack } from "@chakra-ui/react";
import { ResponsiveText } from "../../../styles/theme/custom";
import useSWR from "swr";
import ErrorWrapper from "../../../components/shared/ErrorWrapper";
import { initCMSFetcher } from "../../../services/fetchers";
import { RegulationsQuery } from "./queries";
import { IP2PRegulationGroup } from "../../../types/p2p";
import RegulationGroup from "./RegulationGroup";
import MultipleCitiesContext from "../../layout/header/city/location/MultipleCitiesContext";

import { useAppDispatch } from "../../../redux/hooks";
import { useEffect } from "react";
import { initDefaultRegulationCodes } from "../../../redux/mainReducer";

const Step2 = () => {
  const dispatch = useAppDispatch();
  const fetcher = initCMSFetcher();

  const { data, error } = useSWR(RegulationsQuery, fetcher) as {
    data: IP2PRegulationGroup[];
    error: boolean;
  };

  useEffect(() => {
    // забираем первичные дефолтные параметры если нет из localStorage
    if (data?.length) {
      dispatch(initDefaultRegulationCodes(data));
    }
  }, [data]);

  return (
    <ErrorWrapper isError={!!error} isLoading={!data}>
      <Box mt="2">
        <MultipleCitiesContext.Provider value={true}>
          {/* <Location /> */}
        </MultipleCitiesContext.Provider>
        {data &&
          data.map((regulationGroup) => (
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
