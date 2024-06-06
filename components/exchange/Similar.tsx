import { Box, Grid, HStack, Text } from "@chakra-ui/react";
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
import Dir from "../shared/Dir";
import ErrorWrapper from "../shared/ErrorWrapper";

const Similar = ({ similarPmPairs }: { similarPmPairs: IPm[][] }) => {
  const fetcher = initParserFetcher();
  const dirs = similarPmPairs.reduce(
    (res: string[], pair: IPm[]) => [...res, `${pair[0].code}_${pair[1].code}`],
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
        ? `~ ${format(1 / course, 2)} ${getCur} за 1 ${giveCur}`
        : `~ ${format(course, 2)} ${giveCur} за 1 ${getCur}`;

    return (
      <HStack mt="3" w="100%" justifyContent="space-between">
        <ResponsiveText
          size="sm"
          variant="no_contrast"
        >{`Курсов ${amountOfCourses}`}</ResponsiveText>
        <ResponsiveText size="sm" variant="no_contrast">
          {rate}
        </ResponsiveText>
      </HStack>
    );
  };

  return (
    <Box3D px="2" w="100%" minH="300px">
      <ResponsiveText fontSize="sm" my="1" variant="no_contrast">
        Похожие направления:
      </ResponsiveText>
      {similarPmPairs.map((pair, index) => {
        const slug = pmsToSlug({
          givePm: pair[0],
          getPm: pair[1],
        });

        return (
          <Dir givePm={pair[0]} getPm={pair[1]} slug={slug}>
            {data?.[index] && renderRate(pair, data[index])}
          </Dir>
        );
      })}
    </Box3D>
  );
};

export default Similar;
