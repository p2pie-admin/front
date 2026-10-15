import { Box, Divider, Text } from "@chakra-ui/react";
import React from "react";

import { TextToHTML } from "../../../shared/helper";
import { IoMdInformationCircle } from "react-icons/io";
import { BoxWrapper, CustomHeader } from "../../../shared/BoxWrapper";
import { useT } from "../../../../services/i18n";

export default function ExchangerDescription({
  description,
}: {
  description?: string;
}) {
  const t = useT();
  if (!description) return <></>;

  return (
    <BoxWrapper>
      <CustomHeader text={t(`Описание`, `Description`)} Icon={IoMdInformationCircle} />
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
