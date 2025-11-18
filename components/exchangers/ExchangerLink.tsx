import { Box, Button, HStack } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import { IExchanger, IParserExchanger } from "../../types/exchanger";
import Dot from "./Dot";
import { exchangerNameToSlug, getStatus } from "./helper";
import ExchangerName from "../shared/ExchangerNameRating";
import { BoxWrapper } from "../shared/BoxWrapper";
import { BsArrowRightShort } from "react-icons/bs";
export default function ExchangerPreview({
  exchanger,
}: {
  exchanger: IExchanger & IParserExchanger;
}) {
  const { name, total_rates } = exchanger;
  return (
    <Box3D
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
      color="bg.500"
      key={name}
      _hover={{
        bgColor: "bg.1000",
        color: "peach.300",
      }}
    >
      <HStack w="100%">
        <Dot color={getStatus(exchanger)} />

        <ExchangerName
          name={name}
          logo={exchanger.logo}
          admin_rating={exchanger.admin_rating}
        />
        <Box ml="auto" color="inherit">
          <BsArrowRightShort size="1.5rem" />
        </Box>
      </HStack>
    </Box3D>
  );
}
