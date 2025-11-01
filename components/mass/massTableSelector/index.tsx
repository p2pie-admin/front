import React from "react";
import { Box3D } from "../../../styles/theme/custom";
import { HStack, Button } from "@chakra-ui/react";
import SideButtons from "./SideButtons";
import CryptoList from "./CryptoList";
// import FiatSelector from "./FiatSelector";

import FiatSelector from "./FiatSelector";
import { IPm } from "../../../types/selector";

export default function MassTableSelector({
  slug,

  cryptoPms,
}: {
  slug: string;

  cryptoPms: IPm[];
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
        <CryptoList slug={slug} cryptoPms={cryptoPms} />
        <FiatSelector slug={slug} />
      </HStack>
    </Box3D>
  );
}
