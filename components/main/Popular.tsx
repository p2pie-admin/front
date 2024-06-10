import {
  Grid,
  HStack,
  Box,
  useColorModeValue,
  VStack,
  Text,
  Divider,
} from "@chakra-ui/react";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import { IPopularDirRates, IPopularRate } from "../../types/rates";
import { IPm } from "../../types/selector";
import { capitalize, pmsToSlug } from "./side/selector/section/PmGroup/helper";
import Name from "./side/selector/section/PmGroup/Name";
import PmButton from "./side/selector/section/PmGroup/PmButton";
import { curToSymbol, format, R } from "../../redux/amountsHelper";
import { PiArrowsSplitThin } from "react-icons/pi";
import { BiLinkExternal } from "react-icons/bi";
import Link from "next/link";

const Popular = ({
  popularRates,
  popularPms,
}: {
  popularRates?: IPopularDirRates;
  popularPms?: IPm[];
}) => {
  if (!popularRates || !popularPms) return <></>;
  const miniTable = Object.entries(popularRates).map(
    ([cryptoCode, buySell]) => {
      const cryptoPm = popularPms.find((pm) => pm.code == cryptoCode);
      if (!cryptoPm) return <></>;
      return (
        <Box my="2">
          <Divider bgColor="whiteAlpha.100" my="2" />
          <Grid
            key={cryptoCode}
            gridTemplateColumns="2fr 4rem 2fr 3fr 3fr"
            alignItems="center"
            gridGap="4"
          >
            <HStack w="fit-content" ml="1rem">
              <PmButton
                color={cryptoPm.color}
                icon={cryptoPm.icon}
                handleToggle={() => {}}
                shaded={false}
              >
                <Name
                  name={capitalize(cryptoPm.en_name)}
                  code={cryptoPm.currency.code} // for crypto
                />
              </PmButton>
            </HStack>
            <Box transform="rotate(-90deg)" color="bg.500" mr="1rem">
              <PiArrowsSplitThin size="3rem" />
            </Box>
            <Box>
              {buySell.buy.map((rate, index) => {
                const pm = popularPms.find((pm) => pm.code == rate.fiat);
                return (
                  <ResponsiveText key={index + "bank"} my="0.5" color="bg.100">
                    {`${capitalize(pm?.ru_name)}`}
                  </ResponsiveText>
                );
              })}
            </Box>
            <Box>
              {buySell.buy.map((rate, index) => {
                const pm = popularPms.find((pm) => pm.code == rate.fiat);
                const slug = pmsToSlug({ givePm: pm, getPm: cryptoPm });
                return (
                  <Link href={`/exchange/${slug}`} passHref>
                    <HStack
                      key={index + "buy"}
                      px="4"
                      borderRadius="md"
                      bgColor="whiteAlpha.100"
                      _hover={{ bgColor: "whiteAlpha.200" }}
                      cursor="pointer"
                      my="0.5"
                      w="100%"
                      justifyContent="space-between"
                      filter="opacity(0.8)"
                      color="red.200"
                    >
                      <BiLinkExternal size="1rem" />
                      <ResponsiveText
                        color="inherit"
                        textAlign="end"
                      >{`${curToSymbol(
                        pm?.currency.code.toUpperCase()
                      )} ${format(rate.course, 2)} `}</ResponsiveText>
                    </HStack>
                  </Link>
                );
              })}
            </Box>
            <Box>
              {buySell.sell.map((rate, index) => {
                const pm = popularPms.find((pm) => pm.code == rate.fiat);
                const slug = pmsToSlug({ givePm: cryptoPm, getPm: pm });
                return (
                  <Link href={`/exchange/${slug}`} passHref>
                    <HStack
                      key={index + "sell"}
                      px="4"
                      borderRadius="md"
                      bgColor="whiteAlpha.100"
                      _hover={{ bgColor: "whiteAlpha.200" }}
                      cursor="pointer"
                      my="0.5"
                      w="100%"
                      justifyContent="space-between"
                      filter="opacity(0.8)"
                      color="green.200"
                    >
                      <BiLinkExternal size="1rem" />
                      <HStack>
                        <ResponsiveText
                          color="inherit"
                          textAlign="end"
                        >{`${curToSymbol(
                          pm?.currency.code.toUpperCase()
                        )} ${format(rate.course, 2)} `}</ResponsiveText>
                      </HStack>
                    </HStack>
                  </Link>
                );
              })}
            </Box>
          </Grid>
        </Box>
      );
    }
  );
  return (
    <Box>
      <Grid gridTemplateColumns="2fr 4rem  2fr 3fr 3fr" gridGap="4">
        <ResponsiveText>Популярные</ResponsiveText>
        <ResponsiveText></ResponsiveText>
        <ResponsiveText></ResponsiveText>
        <ResponsiveText>Покупка </ResponsiveText>
        <ResponsiveText>Продажа</ResponsiveText>
      </Grid>
      {miniTable}
    </Box>
  );
};

export default Popular;
