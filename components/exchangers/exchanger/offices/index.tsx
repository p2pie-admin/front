import React from "react";
import { IExchangerOffice } from "../../../../types/exchanger";
import { Box, Button, Divider, HStack, VStack } from "@chakra-ui/react";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import CustomImage from "../../../shared/CustomImage";
import { LuMapPin } from "react-icons/lu";
import { LinkWrapper } from "../../../exchange/pmLayout/LinkWrapper";

export default function OfficesDescription({
  offices,
}: {
  offices?: IExchangerOffice[];
}) {
  if (!offices) return <></>;
  return (
    <Box3D mt="4" p="4" variant="contrast" w="100%">
      <ResponsiveText size="xl" fontWeight="bold" variant="primary">
        Адреса офисов
      </ResponsiveText>

      {offices.map((office) => (
        <React.Fragment key={office.id + office.address}>
          <Divider my="4" />
          <HStack w="100%" gap="4" alignItems="center">
            <Box borderRadius="lg" overflow="hidden">
              <CustomImage img={office.image} w="180" h="auto" />
            </Box>
            <Divider orientation="vertical" h="60px" />
            <VStack alignItems="start" gap="4" w="80%">
              <HStack alignItems="center">
                <ResponsiveText whiteSpace="unset" size="lg" fontWeight="bold">
                  {office.address}
                </ResponsiveText>
                <LuMapPin size="1.2rem" />
              </HStack>

              <ResponsiveText whiteSpace="unset">
                {office.description}
              </ResponsiveText>
              <HStack justifyContent="space-between" w="100%">
                {office.working_time && (
                  <ResponsiveText>
                    Время работы: {office.working_time}
                  </ResponsiveText>
                )}
                <LinkWrapper url={`/map/${office.city}`} exists={!!office.city}>
                  <Button size="sm" variant="outline">
                    Показать на карте
                  </Button>
                </LinkWrapper>
              </HStack>
            </VStack>
            {office.description}
          </HStack>
        </React.Fragment>
      ))}
    </Box3D>
  );
}
