import { Box, VStack, Text } from "@chakra-ui/react";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import { IPm } from "../../types/selector";
import { pmsToSlug } from "../main/side/selector/section/PmGroup/helper";
import useSWR from "swr";
import { initParserFetcher } from "../../services/fetchers";
import { format } from "../../redux/amountsHelper";
import Dir from "./Dir";
import { useTranslation } from "next-i18next";

import { IMassDirTextId } from "../../types/mass";
import renderSimilarMass from "./SimilarMass";
import { buildRateString } from "../shared/helper";
import { t } from "i18next";

const MAX_TO_SHOW = 4;

const SimilarList = ({
  similarPmPairs,
  givePm,
  getPm,
  dirTextIds,
}: {
  similarPmPairs: IPm[][];
  givePm: IPm;
  getPm: IPm;
  dirTextIds: IMassDirTextId[];
}) => {
  const fetcher = initParserFetcher();
  const { t } = useTranslation();
  const dirs = similarPmPairs
    .slice(0, MAX_TO_SHOW)
    .reduce(
      (res: string[], pair: IPm[]) => [
        ...res,
        `${pair[0].code}_${pair[1].code}`,
      ],
      []
    );

  const { data } = useSWR(
    `similar/dirs=${JSON.stringify(dirs)
      .replace("[", "")
      .replace("]", "")
      .replaceAll('"', "")}`,
    fetcher
  ) as { data: ([number, number] | [])[] | undefined };

  const renderRate = (
    pair: IPm[],
    [course, amountOfCourses]: [number, number] | []
  ) => {
    const [giveCur, getCur] = [
      pair[0].currency.code.toUpperCase(),
      pair[1].currency.code.toUpperCase(),
    ];
    if (!course) return {};
    const rate = buildRateString({ course, giveCur, getCur });

    return {
      amountOfCourses,
      rateText: rate,
    };
  };
  const similarMass = renderSimilarMass({
    givePm,
    getPm,
    dirTextIds,
    similarPmPairs: similarPmPairs.slice(3, 11),
  });

  return (
    <Box h={{ base: "fit-content" }}>
      <ResponsiveText mt="6" variant="contrast" mb="4">
        {t("main:similarDirs")}
      </ResponsiveText>
      <VStack gap="4" w="100%">
        {similarMass}

        {similarPmPairs
          .slice(0, !similarMass ? MAX_TO_SHOW : 3)
          .map((pair, index) => {
            const slug = pmsToSlug({
              givePm: pair[0],
              getPm: pair[1],
            });

            const rateData = data?.[index] && renderRate(pair, data[index]);

            return (
              <Dir
                key={slug + index}
                fullHeight
                givePm={pair[0]}
                getPm={pair[1]}
                slug={slug}
                bottomLeft={
                  rateData ? (
                    <Text
                      fontSize="sm"
                      whiteSpace={"nowrap"}
                      variant="no_contrast"
                      mt="1"
                    >
                      {`${t("main:exchangers")} ${rateData.amountOfCourses}`}
                    </Text>
                  ) : null
                }
                bottomRight={
                  rateData ? (
                    <Text
                      whiteSpace={"nowrap"}
                      fontSize="sm"
                      variant="no_contrast"
                      textAlign="end"
                      mt="1"
                    >
                      {rateData.rateText}
                    </Text>
                  ) : null
                }
              />
            );
          })}
      </VStack>
    </Box>
  );
};

export default SimilarList;
