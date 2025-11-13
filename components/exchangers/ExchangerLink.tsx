import { Button, HStack } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { ResponsiveText } from "../../styles/theme/custom";
import { IExchanger, IParserExchanger } from "../../types/exchanger";
import Dot from "./Dot";
import { exchangerNameToSlug, getStatus } from "./helper";
import ExchangerName from "../shared/ExchangerNameRating";
import { BoxWrapper } from "../shared/BoxWrapper";

export default function ExchangerPreview({
  exchanger,
}: {
  exchanger: IExchanger & IParserExchanger;
}) {
  const { name, total_rates } = exchanger;
  return (
    <BoxWrapper
      w="100%"
      as={Link}
      href={`/exchangers/${exchangerNameToSlug(name)}`}
      prefetch={false}
      px="4"
      py="4"
      variant="extra_contrast"
      minW={{ base: "90vw", md: "250px" }}
      justifyContent="start"
      alignItems="center"
      key={name}
    >
      <HStack w="100%">
        <Dot color={getStatus(exchanger)} />

        <ExchangerName
          name={name}
          logo={exchanger.logo}
          admin_rating={exchanger.admin_rating}
        />
      </HStack>
    </BoxWrapper>
  );
}
