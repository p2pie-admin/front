"use client";

import Link from "next/link";
import { Box, Heading, Divider } from "@chakra-ui/react";
import DOMPurify from "isomorphic-dompurify";
import { ICity, IDirText, IPmData } from "../../types/exchange";
import { IPm } from "../../types/selector";
import { capitalize } from "../main/side/selector/section/PmGroup/helper";
import { TextToHTML } from "../shared/helper";
import { ResponsiveText } from "../../styles/theme/custom";

export const fillWords = ({
  givePmData,
  getPmData,
  cityName,
  text,
}: {
  givePmData: IPmData;
  getPmData: IPmData;
  cityName?: string;
  text?: string;
}) => {
  if (!text) return null;

  const [givePm, getPm] = [givePmData?.pm, getPmData?.pm];

  const makeSlug = (pm: IPm) =>
    `/articles/${pm.en_name.toLowerCase().replace(/\s+/g, "-")}`;

  const parts = text.split(
    /(give_name|get_name|give_currency|get_currency|city_name)/g,
  );

  return parts.map((part, index) => {
    switch (part) {
      case "give_name":
        return givePmData.exists ? (
          <Link key={index} href={makeSlug(givePm)}>
            {capitalize(givePm?.ru_name || givePm.en_name)}
          </Link>
        ) : (
          <>{capitalize(givePm?.ru_name || givePm.en_name)}</>
        );

      case "get_name":
        return getPmData.exists ? (
          <Link key={index} href={makeSlug(getPm)}>
            {capitalize(getPm.ru_name || getPm.en_name)}
          </Link>
        ) : (
          <>{capitalize(getPm.ru_name || getPm.en_name)}</>
        );

      case "give_currency":
        return givePm.currency.code.toUpperCase();
      case "get_currency":
        return getPm.currency.code.toUpperCase();
      case "city_name":
        return cityName || "";
      default:
        return part;
    }
  });
};

const allowedHtmlTags = [
  "a",
  "b",
  "br",
  "em",
  "h2",
  "h3",
  "i",
  "li",
  "ol",
  "p",
  "strong",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "ul",
];

const htmlTagPattern = new RegExp(
  `</?(?:${allowedHtmlTags.join("|")})(?:\\s|>|/)`,
  "i",
);

const sanitizeHtml = (html: string) =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedHtmlTags,
    ALLOWED_ATTR: [
      "colspan",
      "headers",
      "href",
      "id",
      "rowspan",
      "scope",
      "title",
    ],
    ALLOW_DATA_ATTR: false,
  });

const DirTextBody = ({ text }: { text?: string }) => {
  if (!text?.trim()) return null;

  const hasHtml = htmlTagPattern.test(text);

  if (!hasHtml) {
    return <TextToHTML text={text} />;
  }

  return (
    <Box
      className="dir-text-content"
      color="bg.200"
      sx={{
        "& p": {
          my: "3",
          lineHeight: "1.85",
        },
        "& strong, & b": {
          color: "bg.100",
          fontWeight: "700",
        },
        "& em, & i": {
          fontStyle: "italic",
        },
        "& h2": {
          color: "bg.100",
          fontSize: { base: "xl", md: "2xl" },
          fontWeight: "700",
          lineHeight: "1.3",
          mt: "8",
          mb: "3",
        },
        "& h3": {
          color: "bg.100",
          fontSize: { base: "lg", md: "xl" },
          fontWeight: "700",
          lineHeight: "1.35",
          mt: "6",
          mb: "2",
        },
        "& ul, & ol": {
          my: "3",
          pl: "6",
        },
        "& li": {
          my: "2",
          lineHeight: "1.75",
        },
        "& a": {
          color: "peach.300",
          fontWeight: "600",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
        },
        "& a:hover": {
          color: "peach.200",
        },
        "& table": {
          width: "100%",
          my: "5",
          borderCollapse: "collapse",
          overflowX: "auto",
          display: "block",
        },
        "& thead": {
          bg: "peach.900",
        },
        "& th, & td": {
          borderWidth: "1px",
          borderColor: "bg.200",
          color: "bg.200",
          px: "3",
          py: "3",
          textAlign: "left",
          verticalAlign: "top",
          lineHeight: "1.6",
        },
        "& th": {
          color: "bg.100",
          fontWeight: "700",
        },
      }}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }}
    />
  );
};

const DirText = ({
  dirText,
  givePmData,
  getPmData,
  city,
}: {
  givePmData: IPmData;
  getPmData: IPmData;
  city: ICity | null;
  dirText: IDirText | null;
}) => {
  //  const cityName = city ? city[`${locale}_name`] : "";

  if (!dirText) return <></>;

  return (
    <Box p="2">
      <Heading as="h1" fontSize="2xl">
        {dirText.header}
      </Heading>
      <ResponsiveText variant="contrast" my="2" whiteSpace={"nowrap"}>
        {dirText.subheader}
      </ResponsiveText>
      <Divider my="5" />

      <DirTextBody text={dirText.text} />
    </Box>
  );
};

export default DirText;
