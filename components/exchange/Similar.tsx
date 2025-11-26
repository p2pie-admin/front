import { Box, VStack } from "@chakra-ui/react";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import { IPm } from "../../types/selector";
import { pmsToSlug } from "../main/side/selector/section/PmGroup/helper";
import useSWR from "swr";
import { initParserFetcher } from "../../services/fetchers";
import { format } from "../../redux/amountsHelper";
import Dir from "./Dir";
import { useTranslation } from "next-i18next";
import SimilarMass from "./SimilarMass";
import { IMassDirTextId } from "../../types/mass";
import renderSimilarMass from "./SimilarMass";

const MAX_TO_SHOW = 4;

const Similar = ({
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
    const rate =
      course < 1
        ? `1 ${giveCur} = ${format(1 / course, 2)} ${getCur}`
        : `1 ${getCur} = ${format(course, 2)} ${giveCur}`;

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
    <Box3D px="4" w="100%" h={{ base: "fit-content", lg: "416px" }}>
      <ResponsiveText mt="5" variant="no_contrast">
        {t("main:similarDirs")}
      </ResponsiveText>
      {similarMass}
      {similarPmPairs
        .slice(0, !similarMass ? MAX_TO_SHOW : 3)
        .map((pair, index) => {
          const slug = pmsToSlug({
            givePm: pair[0],
            getPm: pair[1],
          });

          const rateData = data?.[index] && renderRate(pair, data[index]);
          if (!rateData) return <></>;
          return (
            <VStack spacing={4} align="stretch" my="4" key={slug + index}>
              <Dir
                fullHeight
                givePm={pair[0]}
                getPm={pair[1]}
                slug={slug}
                bottomLeft={
                  rateData ? (
                    <ResponsiveText size="xs" variant="no_contrast">
                      {`${t("main:exchangers")} ${rateData.amountOfCourses}`}
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
            </VStack>
          );
        })}
    </Box3D>
  );
};

export default Similar;
