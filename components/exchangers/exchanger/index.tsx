import React from "react";
import { IExchanger, IParserExchanger } from "../../../types/exchanger";
import { HStack, Box, Center, Spinner } from "@chakra-ui/react";

import { TbExternalLink } from "react-icons/tb";
import { Box3D, ResponsiveText } from "../../../styles/theme/custom";
import { LinkWrapper } from "../../exchange/pmLayout/LinkWrapper";
import { capitalize } from "../../main/side/selector/section/PmGroup/helper";
import { useRouter } from "next/router";
import UniversalSeo from "../../shared/UniversalSeo";
import { ISEO } from "../../../types/general";
import { IPm } from "../../../types/selector";

export default function Exchanger({
  exchanger,
  seo,
  articleCodes = [],
  pms = [],
}: {
  exchanger: IExchanger & IParserExchanger;
  seo: ISEO;
  articleCodes: string[];
  pms: IPm[];
}) {
  if (!exchanger || !exchanger.ref_link) {
    return (
      <Center
        w="100%"
        h="100%"
        justifyContent="center"
        alignItems="center"
        minW="100"
        minH="100"
      >
        <Spinner size="xl" color="bg.500" />
      </Center>
    );
  }

  const { locale } = useRouter() as { locale: "en" | "ru" };

  const description =
    exchanger.exchanger_card[`${locale}_description`] || "no description";

  return (
    <>
      <UniversalSeo seo={seo} />
      <ResponsiveText
        fontWeight="bold"
        size="4xl"
        variant="primary"
        color="green.500"
        textAlign="center"
        mb="4"
      >
        {"pms " + pms.length}
      </ResponsiveText>
      <ResponsiveText
        fontWeight="bold"
        size="4xl"
        variant="primary"
        color="red.500"
        textAlign="center"
        mb="4"
      >
        {"articleCodes " + articleCodes.length}
      </ResponsiveText>
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
    </>
  );
}
