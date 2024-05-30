import { Box, Grid, HStack, Text } from "@chakra-ui/react";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import { IPm } from "../../types/selector";
import {
  capitalize,
  pmsToSlug,
} from "../main/side/selector/section/PmGroup/helper";
import { BsArrowRightShort } from "react-icons/bs";
import CircularIcon from "../shared/CircularIcon";
import useSWR from "swr";
import { initParserFetcher } from "../../services/fetchers";
import { format } from "../../redux/amountsHelper";
import { useRouter } from "next/router";
import Link from "next/link"; // Import Link from next/link

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
    data: any;
    error: any;
  };

  const renderRate = (pair: IPm[], course: number) => {
    const [giveCur, getCur] = [
      pair[0].currency.code.toUpperCase(),
      pair[1].currency.code.toUpperCase(),
    ];
    const leftSide = course > 1 ? "" : `1 ${giveCur} ~`;
    const rightSide = course > 1 ? `${giveCur} ~ 1 ${getCur}` : getCur;
    return `Курсы от: ${leftSide} ${
      course > 1 ? format(course, 2) : format(1 / course, 2)
    } ${rightSide}`;
  };

  return (
    <Box3D px="2" mt="auto" flexShrink="0">
      {similarPmPairs.map((pair, index) => {
        const slug = pmsToSlug({
          givePm: pair[0],
          getPm: pair[1],
        });

        return (
          <Link href={`/exchange/${slug}`} key={index} passHref>
            <Box
              borderRadius="lg"
              border="1px dashed"
              borderColor="whiteAlpha.200"
              p="2"
              my="2"
              cursor="pointer"
              transition="background 0.1s ease-in"
              _hover={{ bgColor: "whiteAlpha.100" }}
              minH="80px"
            >
              <Grid
                gridTemplateColumns={"40px 1fr 40px 40px 1fr"}
                color="bg.500"
              >
                <CircularIcon
                  icon={pair[0].icon}
                  color={pair[0].color || "gray"}
                />
                <ResponsiveText>{`${capitalize(
                  pair[0].en_name.slice(0, 12)
                )} ${pair[0].currency.code.toUpperCase()}`}</ResponsiveText>
                <BsArrowRightShort size="1.5rem" />
                <CircularIcon
                  icon={pair[1].icon}
                  color={pair[1].color || "gray"}
                />
                <ResponsiveText>{`${capitalize(
                  pair[1].en_name.slice(0, 12)
                )} ${pair[1].currency.code.toUpperCase()}`}</ResponsiveText>
              </Grid>
              {data?.[index] && (
                <ResponsiveText
                  size="sm"
                  mt="3"
                  variant="no_contrast"
                  textAlign="end"
                >
                  {renderRate(pair, data[index])}
                </ResponsiveText>
              )}
            </Box>
          </Link>
        );
      })}
    </Box3D>
  );
};

export default Similar;
