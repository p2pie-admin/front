import { Box, Grid, Text, Tooltip } from "@chakra-ui/react";
import React, { useContext } from "react";
import { ResponsiveText } from "../../../styles/theme/custom";
import Link from "next/link";
import {
  convertMassDirTextIntoSlug,
  convertSlugIntoMassDirText,
} from "../../../cache/helper";
import MassSideContext from "../sideContext";
import { ICryptoCodesName, IMassDirTextId } from "../../../types/mass";
import { IPm } from "../../../types/selector";

export default function CryptoList({
  slug,

  cryptoCodesNames,
}: {
  slug: string;

  cryptoCodesNames: ICryptoCodesName[];
}) {
  const isSell = useContext(MassSideContext);
  const { code: currentCode, currency } = convertSlugIntoMassDirText(
    slug,
    isSell
  );

  const ccnVisible = cryptoCodesNames.slice(0, 16);

  return (
    <Grid
      mx="2"
      templateRows="repeat(2, 1fr)" // 2 rows
      templateColumns={`repeat(${Math.ceil(ccnVisible.length / 2)}, 1fr)`} // auto columns
      columnGap={6}
      rowGap="0"
    >
      {ccnVisible.map(({ code, name, subgroup_name, currencyCode }) => {
        const newData = {
          code,
          currency,
          isSell,
        } as IMassDirTextId;

        const newSlug = convertMassDirTextIntoSlug(newData);

        return (
          <Tooltip label={name} fontSize="sm">
            <Link href={`${newSlug}`} key={code}>
              <ResponsiveText
                as="div"
                position="relative"
                textAlign="start"
                cursor="pointer"
                fontWeight={code == currentCode ? "bold" : "unset"}
                variant={code == currentCode ? "primary" : "no_contrast"}
              >
                {currencyCode}
                {code == currentCode && (
                  <Box
                    w="6px"
                    h="6px"
                    borderRadius="50%"
                    bgColor="peach.300"
                    position="absolute"
                    left="-3"
                    top="calc(50% - 3px)"
                  />
                )}

                {subgroup_name && (
                  <Box
                    borderRadius="sm"
                    px="1px"
                    py="0"
                    bgColor="bg.700"
                    position="absolute"
                    right="-3"
                    bottom="-1.5"
                  >
                    <ResponsiveText
                      fontSize="10"
                      variant={code == currentCode ? "primary" : "no_contrast"}
                    >
                      {subgroup_name}
                    </ResponsiveText>
                  </Box>
                )}
              </ResponsiveText>
            </Link>
          </Tooltip>
        );
      })}
    </Grid>
  );
}
