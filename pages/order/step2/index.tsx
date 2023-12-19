import { Box, HStack } from "@chakra-ui/react";
import { ResponsiveText } from "../../../styles/theme/custom";
import useSWR from "swr";
import ErrorWrapper from "../../../components/shared/ErrorWrapper";
import { initCMSFetcher } from "../../../services/fetchers";
import { RegulationsQuery } from "./queries";
import { IP2PRegulationGroup } from "../../../types/p2p";
import RegulationGroup from "./RegulationGroup";

const Step2 = () => {
  const fetcher = initCMSFetcher();
  const { data, error } = useSWR(RegulationsQuery, fetcher) as {
    data: {
      regulationGroups: any;
    };
    error: boolean;
  };

  const regulationGroups = data?.regulationGroups as IP2PRegulationGroup[];

  return (
    <ErrorWrapper isError={!!error} isLoading={!regulationGroups}>
      <Box>
        {regulationGroups &&
          regulationGroups.map((regulationGroup) => (
            <RegulationGroup regulationGroup={regulationGroup} />
          ))}
      </Box>
    </ErrorWrapper>
  );
};

export default Step2;
