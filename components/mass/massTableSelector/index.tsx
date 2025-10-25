import React from "react";
import { Box3D } from "../../../styles/theme/custom";
import { HStack, Button } from "@chakra-ui/react";
import SideButtons from "./SideButtons";
import CryptoList from "./CryptoList";
// import FiatSelector from "./FiatSelector";
import { IPm } from "../../../types/selector";
import { ICryptoCodesName } from "../../../types/mass";
import FiatSelector from "./FiatSelector";

export default function MassTableSelector({
  slug,

  cryptoCodesNames,
}: {
  slug: string;

  cryptoCodesNames: ICryptoCodesName[];
}) {
  return (
    <Box3D
      variant="no_contrast"
      w="100%"
      minH="10"
      px={["2", "4"]}
      py={["2", "4"]}
    >
      <HStack>
        <SideButtons slug={slug} />
        <CryptoList slug={slug} cryptoCodesNames={cryptoCodesNames} />
        <FiatSelector slug={slug} />
      </HStack>
    </Box3D>
  );
}
