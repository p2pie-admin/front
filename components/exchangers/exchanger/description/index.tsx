import { Box, Divider, Text } from "@chakra-ui/react";
import React from "react";

import { TextToHTML } from "../../../shared/helper";
import { IoMdInformationCircle } from "react-icons/io";
import { BoxWrapper, CustomHeader } from "../../../shared/BoxWrapper";

export default function ExchangerDescription({
  description,
}: {
  description?: string;
}) {
  if (!description) return <></>;

  return (
    <BoxWrapper>
      <CustomHeader text={`Описание`} Icon={IoMdInformationCircle} />
      <Divider my="4" />
      <Box px="2" color="bg.400">
        {description && (
          <TextToHTML
            text={description}
            components={{
              p: ({ children }) => (
                <Text color="bg.300" px="2" my="2">
                  {children}
                </Text>
              ),
            }}
          />
        )}
      </Box>
    </BoxWrapper>
  );
}
