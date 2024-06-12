import { Box, color, HStack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { BiLinkExternal } from "react-icons/bi";
import { ResponsiveText } from "../../../styles/theme/custom";
import { IoSearch } from "react-icons/io5";

const RateLink = ({
  slug,
  rateNumber,
  side,
}: {
  slug: string;
  rateNumber: string;
  side: "buy" | "sell";
}) => {
  return (
    <Link href={`/exchange/${slug}`} passHref>
      <HStack
        px="1"
        borderRadius="md"
        bgColor="blackAlpha.200"
        _hover={{ bgColor: "whiteAlpha.100" }}
        cursor="pointer"
        my="0.5"
        w="100%"
        justifyContent={"space-between"}
        filter="opacity(0.8)"
      >
        <Text color="bg.500">{side === "buy" ? "от" : "до"}</Text>
        <ResponsiveText
          color={side === "buy" ? "pink.200" : "green.200"}
          textAlign="end"
        >
          {rateNumber}
        </ResponsiveText>
      </HStack>
    </Link>
  );
};

export default RateLink;
