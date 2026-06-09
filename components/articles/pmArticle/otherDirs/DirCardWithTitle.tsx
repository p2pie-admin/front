import { Box, Center } from "@chakra-ui/react";
import React, { useMemo } from "react";
import Dir from "../../../exchange/Dir";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import { IPmPairs } from "../../../../types/exchange";
import { dirTitle } from "./dirTitle";
import { GetRateDataFn } from "./useDirRates";

type DirCardWithTitleProps = {
  pair?: IPmPairs | null;
  side: "sell" | "buy";
  getRateData: GetRateDataFn;
  placeholderHeight: string;
};

const DirCardWithTitle = ({
  pair,
  side,
  getRateData,
  placeholderHeight,
}: DirCardWithTitleProps) => {
  const rateData = pair ? getRateData(pair) : null;

  // Add Moscow city to cash directions that don't have a city
  const adjustedSlug = useMemo(() => {
    if (!pair) return "";

    const { slug, givePm, getPm } = pair;

    // Check if either payment method is cash (section === "cash")
    const hasCash = givePm?.section === "cash" || getPm?.section === "cash";

    // If it's a cash direction and slug doesn't contain a city (no underscore after direction)
    // Example: "usdtrub" should become "usdtrub_moscow"
    if (hasCash && !slug.includes("_")) {
      return `${slug}_moscow`;
    }

    return slug;
  }, [pair]);

  return (
    <Box w="100%" mt="6">
      {pair ? (
        <Box minH={placeholderHeight}>
          <ResponsiveText as="h4" size="xs" variant="shaded" mb="2">
            {dirTitle(pair, side)}
          </ResponsiveText>
          <Dir
            givePm={pair.givePm}
            getPm={pair.getPm}
            slug={adjustedSlug}
            fullHeight
            bottomLeft={
              rateData ? (
                <ResponsiveText size="xs" variant="no_contrast">
                  {`Предложений: ${rateData.amountOfCourses}`}
                </ResponsiveText>
              ) : null
            }
            bottomRight={
              rateData ? (
                <ResponsiveText size="xs" variant="no_contrast">
                  {rateData.rateText}
                </ResponsiveText>
              ) : null
            }
          />
        </Box>
      ) : (
        <Box>
          <ResponsiveText as="h4" size="xs" variant="shaded" mb="2">
            Нет обратного направления
          </ResponsiveText>
          <Box3D variant="extra_contrast">
            <Center minH={placeholderHeight} w="100%" color="whiteAlpha.200">
              ㄨ
            </Center>
          </Box3D>
        </Box>
      )}
    </Box>
  );
};

export default DirCardWithTitle;
