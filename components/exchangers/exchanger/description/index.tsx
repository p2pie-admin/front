import { HStack, Box, Divider } from "@chakra-ui/react";
import React from "react";

import { TextToHTML } from "../../../shared/helper";
import { IoMdInformationCircle } from "react-icons/io";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import { CustomHeader } from "../shared";

export default function ExchangerDescription({
  description,
}: {
  description?: string;
}) {
  if (!description) return <></>;

  return (
    <Box3D mt="8" p="4" variant="contrast">
      <CustomHeader text={`Описание`} Icon={IoMdInformationCircle} />
      <Divider my="4" />
      {description && <TextToHTML text={description} />}
    </Box3D>
  );
}
