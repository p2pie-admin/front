"use client";

import Link from "next/link";
import { Box, Text, Heading, Divider } from "@chakra-ui/react";
import { ICity, IDirText } from "../../types/exchange";
import { IPm } from "../../types/selector";
import { capitalize } from "../main/side/selector/section/PmGroup/helper";
import { TextToHTML } from "../shared/helper";

export const fillWords = ({
  locale,
  givePm,
  getPm,
  cityName,
  text,
}: {
  locale: "en" | "ru";
  givePm: IPm;
  getPm: IPm;
  cityName?: string;
  text?: string;
}) => {
  if (!text) return null;

  const makeSlug = (pm: IPm) =>
    `/articles/${pm.en_name.toLowerCase().replace(/\s+/g, "-")}`;

  const parts = text.split(
    /(give_name|get_name|give_currency|get_currency|city_name)/g
  );

  return parts.map((part, index) => {
    switch (part) {
      case "give_name":
        return (
          <Link key={index} href={makeSlug(givePm)}>
            {capitalize(givePm[`${locale}_name`] || givePm.en_name)}
          </Link>
        );

      case "get_name":
        return (
          <Link key={index} href={makeSlug(getPm)}>
            {capitalize(getPm[`${locale}_name`] || getPm.en_name)}
          </Link>
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

const DirText = ({
  dirText,
  locale,
  givePm,
  getPm,
  city,
}: {
  locale: "en" | "ru";
  givePm: IPm;
  getPm: IPm;
  city: ICity | null;
  dirText: IDirText | null;
}) => {
  const cityName = city ? city[`${locale}_name`] : "";

  if (!dirText) return <></>;

  return (
    <Box p="2">
      <Heading as="h2" fontSize="2xl">
        {fillWords({
          locale,
          givePm,
          getPm,
          cityName,
          text: dirText.header,
        })}
      </Heading>

      <Divider my="5" />

      <Heading as="h3" fontSize="lg" mb="2">
        {fillWords({
          locale,
          givePm,
          getPm,
          cityName,
          text: dirText.subheader,
        })}
      </Heading>

      <Text>{dirText.text}</Text>
    </Box>
  );
};

export default DirText;
