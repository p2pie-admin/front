import { Button, HStack } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import { IExchanger, IParserExchanger } from "../../types/exchanger";
import Dot from "./Dot";
import { exchangerNameToSlug, getStatus } from "./helper";

export default function ExchangerPreview({
  exchanger,
}: {
  exchanger: IExchanger & IParserExchanger;
}) {
  const { name, total_rates } = exchanger;
  return (
    <Link
      href={`/exchangers/${exchangerNameToSlug(name)}`}
      key={name}
      prefetch={false}
    >
      <Box3D
        key={name}
        as={Button}
        px="4"
        py="2"
        variant="extra_contrast"
        minW={{ base: "90vw", md: "250px" }}
        justifyContent="start"
        alignItems="center"
        h="12"
      >
        <HStack w="100%">
          <Dot color={getStatus(exchanger)} />
          <HStack w="100%" justifyContent="space-between">
            <ResponsiveText size={name.length > 10 ? "sm" : "md"}>
              {name}
            </ResponsiveText>
            {total_rates && (
              <ResponsiveText fontWeight="regular">{`(${total_rates})`}</ResponsiveText>
            )}
          </HStack>
        </HStack>
      </Box3D>
    </Link>
  );
}
