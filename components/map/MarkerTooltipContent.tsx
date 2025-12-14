import { VStack, Divider, Text, HStack, Box, Center } from "@chakra-ui/react";
import { memo, useMemo } from "react";
import { IExchanger } from "../../types/exchanger";
import { ResponsiveText } from "../../styles/theme/custom";
import ExchangerName from "../shared/ExchangerNameRating";
import CustomImage from "../shared/CustomImage";

export const MarkerTooltipContent = memo(
  ({ exchanger }: { exchanger: IExchanger }) => {
    const { exchanger_card, offices, admin_rating, logo } = exchanger;
    const displayName = exchanger.display_name || exchanger.name;

    const office = offices?.[0];

    const contact = useMemo(() => {
      return exchanger_card?.telegram || exchanger_card?.email || null;
    }, [exchanger_card?.telegram, exchanger_card?.email]);

    return (
      <VStack align="start" spacing="1" p="2">
        <ExchangerName
          name={displayName}
          admin_rating={admin_rating}
          logo={logo}
        />
        <ResponsiveText fontSize="md" fontWeight="bold" whiteSpace="unset">
          {office?.address}
        </ResponsiveText>
        <Divider />
        {office?.working_time && (
          <HStack alignItems="center">
            <Box w="8px" h="8px" bg="green.200" borderRadius="50%" />
            <ResponsiveText fontSize="sm" whiteSpace="unset">
              {`Время работы: ${office?.working_time}`}
            </ResponsiveText>
          </HStack>
        )}

        <ResponsiveText fontSize="xs" whiteSpace="unset">
          {office?.description}
        </ResponsiveText>
        {office?.image && (
          <Center w="100%">
            <CustomImage img={office?.image} w="auto" h="auto" />
          </Center>
        )}

        {/* {contact && (
          <>
            <Divider borderColor="whiteAlpha.300" my="1" />
            <ResponsiveText fontSize="xs" color="bg.200">
              {contact}
            </ResponsiveText>
          </>
        )} */}
      </VStack>
    );
  }
);
