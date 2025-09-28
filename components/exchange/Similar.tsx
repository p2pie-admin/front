import {
  Box,
  Grid,
  HStack,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import { IPm } from "../../types/selector";
import { pmsToSlug } from "../main/side/selector/section/PmGroup/helper";
import { BsArrowRightShort } from "react-icons/bs";
import useSWR from "swr";
import { initParserFetcher } from "../../services/fetchers";
import { format } from "../../redux/amountsHelper";
import { useRouter } from "next/router";
import Link from "next/link"; // Import Link from next/link
import PmName from "../shared/PmName";
import Dir from "./Dir";
import ErrorWrapper from "../shared/ErrorWrapper";
import { useTranslation } from "next-i18next";
import SimilarMass from "./SimilarMass";
import { IMassDirTextId } from "../../types/mass";

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
    .slice(0, 3)
    .reduce(
      (res: string[], pair: IPm[]) => [
        ...res,
        `${pair[0].code}_${pair[1].code}`,
      ],
      []
    );

  const { data, error } = useSWR(
    `similar/dirs=${JSON.stringify(dirs)
      .replace("[", "")
      .replace("]", "")
      .replaceAll('"', "")}`,
    fetcher
  ) as {
    data: [number, number][];
    error: any;
  };

  const renderRate = (
    pair: IPm[],
    [course, amountOfCourses]: [number, number]
  ) => {
    const [giveCur, getCur] = [
      pair[0].currency.code.toUpperCase(),
      pair[1].currency.code.toUpperCase(),
    ];
    const rate =
      course < 1
        ? `1 ${giveCur} ~ ${format(1 / course, 2)} ${getCur}`
        : `1 ${getCur} ~ ${format(course, 2)} ${giveCur}`;

    return (
      <HStack w="100%" justifyContent="space-between" mt="2">
        <ResponsiveText size="sm" variant="no_contrast">{`${t(
          "main:exchangers"
        )} ${amountOfCourses}`}</ResponsiveText>
        <ResponsiveText size="sm" variant="no_contrast">
          {rate}
        </ResponsiveText>
      </HStack>
    );
  };

  return (
    <Box3D px="4" w="100%" h={{ base: "fit-content", lg: "416px" }}>
      <ResponsiveText mt="4" mb="-2" variant="no_contrast">
        {t("main:similarDirs")}
      </ResponsiveText>
      <SimilarMass
        similarPmPairs={similarPmPairs.slice(3, 11)}
        givePm={givePm}
        getPm={getPm}
        dirTextIds={dirTextIds}
      />
      {similarPmPairs.slice(0, 3).map((pair, index) => {
        const slug = pmsToSlug({
          givePm: pair[0],
          getPm: pair[1],
        });

        return (
          <VStack spacing={4} align="stretch" my="4" key={slug + index}>
            <Dir givePm={pair[0]} getPm={pair[1]} slug={slug}>
              {data?.[index] && renderRate(pair, data[index])}
            </Dir>
          </VStack>
        );
      })}
    </Box3D>
  );
};

export default Similar;
