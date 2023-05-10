import { Box, Text } from "@chakra-ui/react";
import useSWR from "swr";
import initFetcher from "../../services/graphql";
import { Box3D } from "../../styles/theme/wrappers";
import { IExchangerData } from "../../types/exchanger";
import { ISelector } from "../../types/selector";
import { capitalize } from "../main/side/pmModalButton/section/PmGroup/helper";
import { exchangerQuery } from "./queries";

const ExchangerDescription = ({
  exchangerId,
}: {
  exchangerId: string | undefined;
}) => {
  const fetcher = initFetcher({ id: exchangerId });

  const { data, error } = useSWR(exchangerQuery, fetcher) as {
    data: { exchanger: IExchangerData };
    error: any;
  };

  if (!exchangerId || !data?.exchanger) return <></>;

  const {
    name,
    status,
    tag,
    ref_link,
    description,
    date_listed,
    admin_rating,
  } = data.exchanger;

  return (
    <Box3D p="4" bgColor="bg.900">
      <Text color="bg.500" textAlign="center">
        {"Exchanger Details"}{" "}
      </Text>
      <Text fontSize="2xl">{capitalize(name)}</Text>
      <Text color="bg.500">{description} </Text>
    </Box3D>
  );
};

export default ExchangerDescription;
