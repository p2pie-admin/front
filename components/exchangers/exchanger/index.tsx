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
import { TextToHTML } from "../../shared/helper";
import { locale } from "../../../services/utils";
import logo from "next-seo/lib/jsonld/logo";
import ExchangerName from "../../shared/ExchangerNameRating";

export default function Exchanger({
  exchanger,
  seo,
}: {
  exchanger: IExchanger & IParserExchanger;
  seo: ISEO;
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

  const description =
    exchanger.exchanger_card?.[`${locale}_description`] || "no description";

  return (
    <>
      <UniversalSeo seo={seo} />

      <Box3D p="4" variant="no_contrast" mt="10">
        <LinkWrapper
          url={exchanger.ref_link}
          articleExists={!!exchanger.ref_link}
        >
          <HStack>
            <ExchangerName
              name={exchanger.name}
              logo={exchanger.logo}
              admin_rating={exchanger.admin_rating}
              isH1={true}
            />
            <TbExternalLink size="1.5rem" />
          </HStack>
        </LinkWrapper>

        <Box>{description && <TextToHTML text={description} />}</Box>
      </Box3D>
    </>
  );
}
