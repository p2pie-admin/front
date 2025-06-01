import React from "react";
import { IExchanger, IParserExchanger } from "../../../types/exchanger";
import { HStack, Box } from "@chakra-ui/react";

import { TbExternalLink } from "react-icons/tb";
import { Box3D, ResponsiveText } from "../../../styles/theme/custom";
import { LinkWrapper } from "../../exchange/pmLayout/LinkWrapper";
import { capitalize } from "../../main/side/selector/section/PmGroup/helper";
import { useRouter } from "next/router";

export default function Exchanger({
  exchanger,
}: {
  exchanger: IExchanger & IParserExchanger;
}) {
  if (!exchanger || !exchanger.ref_link) {
    return (
      <Box3D p="4" variant="no_contrast" mt="10">
        <ResponsiveText fontWeight="bold" size="xl" variant="primary" as="h1">
          {exchanger ? capitalize(exchanger.name) : "Exchanger not found"}
        </ResponsiveText>
      </Box3D>
    );
  }

  const { locale } = useRouter() as { locale: "en" | "ru" };
  const { email, telegram, working_time } = exchanger?.exchanger_card;
  const description = exchanger.exchanger_card[`en_description`];

  return (
    <Box3D p="4" variant="no_contrast" mt="10">
      <LinkWrapper
        url={exchanger.ref_link}
        articleExists={!!exchanger.ref_link}
      >
        <HStack>
          <ResponsiveText
            fontWeight="bold"
            size="4xl"
            variant="primary"
            as="h1"
          >
            {capitalize(exchanger.name)}
          </ResponsiveText>
          <TbExternalLink size="1.5rem" />
        </HStack>
      </LinkWrapper>

      <Box>
        {description && (
          <div dangerouslySetInnerHTML={{ __html: description }} />
        )}
      </Box>
    </Box3D>
  );
}
