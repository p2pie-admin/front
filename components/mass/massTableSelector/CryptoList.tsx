import { Box, Grid, Text, Tooltip } from "@chakra-ui/react";
import React, { useContext } from "react";
import { ResponsiveText } from "../../../styles/theme/custom";
import Link from "next/link";
import {
  convertMassDirTextIntoSlug,
  convertSlugIntoMassDirText,
} from "../../../cache/helper";
import MassSideContext from "../sideContext";
import { IMassDirTextId } from "../../../types/mass";
import { IPm } from "../../../types/selector";

export default function CryptoList({
  slug,

  cryptoPms,
}: {
  slug: string;

  cryptoPms: IPm[];
}) {
  const isSell = useContext(MassSideContext);
  const { code: currentCode, currency } = convertSlugIntoMassDirText(
    slug,
    isSell
  );

  const ccnVisible = cryptoPms.slice(0, 16);

  return (
    <Grid
      mx="2"
      templateRows="repeat(2, 1fr)" // 2 rows
      templateColumns={`repeat(${Math.ceil(ccnVisible.length / 2)}, 1fr)`} // auto columns
      columnGap={6}
      rowGap="0"
    >
      {ccnVisible.map((pm) => {
        const newData = {
          code: pm.code,
          currency,
          isSell,
        } as IMassDirTextId;

        const newSlug = convertMassDirTextIntoSlug(newData);

        return (
          <Tooltip label={pm.en_name} fontSize="sm">
            <Link href={`${newSlug}`} key={pm.code}>
              <ResponsiveText
                as="div"
                position="relative"
                textAlign="start"
                cursor="pointer"
                fontWeight={pm.code == currentCode ? "bold" : "unset"}
                variant={pm.code == currentCode ? "primary" : "no_contrast"}
              >
                {pm.currency.code}
                {pm.code == currentCode && (
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

                {pm.subgroup_name && (
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
                      variant={
                        pm.code == currentCode ? "primary" : "no_contrast"
                      }
                    >
                      {pm.subgroup_name}
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
