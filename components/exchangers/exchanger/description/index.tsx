import { HStack, Box, Divider } from "@chakra-ui/react";
import React from "react";

import { TextToHTML } from "../../../shared/helper";

import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";

export default function ExchangerDescription({
  description,
}: {
  description?: string;
}) {
  if (!description) return <></>;

  return (
    <Box3D mt="4" p="4" variant="contrast">
      <ResponsiveText size="xl" fontWeight="bold" variant="primary">
        Описание
      </ResponsiveText>
      <Divider my="4" />
      {description && <TextToHTML text={description} />}
    </Box3D>
  );
}
