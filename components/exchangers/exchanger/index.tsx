import React from "react";
import { IExchanger, IParserExchanger } from "../../../types/exchanger";
import { HStack, Box } from "@chakra-ui/react";

import { TbExternalLink } from "react-icons/tb";
import { Box3D, ResponsiveText } from "../../../styles/theme/custom";
import { LinkWrapper } from "../../exchange/pmLayout/LinkWrapper";
import { capitalize } from "../../main/side/selector/section/PmGroup/helper";
import { useRouter } from "next/router";
import article from "../../article";
import UniversalSeo from "../../shared/UniversalSeo";
import { exchangerNameToSlug } from "../helper";

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
  const title = ` ${locale == "en" ? "Exchanger" : "Обменник"} ${capitalize(
    exchanger.name
  )}`;
  const description =
    exchanger.exchanger_card[`${locale}_description`] || "no description";

  const normalizedCode = exchangerNameToSlug(exchanger.name);

  return (
    <>
      <UniversalSeo
        title={title}
        description={description}
        canonicalPath={`${locale}/exchangers/${normalizedCode}`}
        isArticle
        locale={locale}
        alternateLangs={[
          {
            rel: "alternate",
            hrefLang: "en",
            href: `https://p2pie.com/en/exchangers/${normalizedCode}`,
          },
          {
            rel: "alternate",
            hrefLang: "ru",
            href: `https://p2pie.com/ru/exchangers/${normalizedCode}`,
          },
        ]}
      />
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
