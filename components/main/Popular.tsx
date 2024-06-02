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
import { IPopularDirRates } from "../../types/rates";
import { IPm } from "../../types/selector";
import { capitalize } from "./side/selector/section/PmGroup/helper";
import Name from "./side/selector/section/PmGroup/Name";
import PmButton from "./side/selector/section/PmGroup/PmButton";
import { curToSymbol, format, R } from "../../redux/amountsHelper";

const Popular = ({
  popularRates,
  popularPms,
}: {
  popularRates: IPopularDirRates;
  popularPms: IPm[];
}) => {
  const miniTable = Object.entries(popularRates).map(
    ([cryptoCode, buySell]) => {
      const cryptoPm = popularPms.find((pm) => pm.code == cryptoCode);
      if (!cryptoPm) return <></>;
      return (
        <Box my="2">
          <Divider />
          <Grid
            key={cryptoCode}
            gridTemplateColumns="3fr 3fr 3fr 2fr"
            alignItems="center"
          >
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

            <Box>
              {buySell.buy.map((rate) => (
                <Box
                  px="0.5"
                  borderRadius="md"
                  bgColor="whiteAlpha.200"
                  my="0.5"
                  w="90%"
                >
                  <ResponsiveText textAlign="end">{`${format(
                    rate.course,
                    2
                  )} `}</ResponsiveText>
                </Box>
              ))}
            </Box>
            <Box>
              {buySell.sell.map((rate) => (
                <Box
                  px="0.5"
                  borderRadius="md"
                  bgColor="whiteAlpha.200"
                  my="0.5"
                  w="90%"
                >
                  <ResponsiveText textAlign="end">{`${format(
                    rate.course,
                    2
                  )} `}</ResponsiveText>
                </Box>
              ))}
            </Box>
            <Box>
              {buySell.buy.map((rate) => {
                const pm = popularPms.find((pm) => pm.code == rate.fiat);
                return (
                  <HStack justifyContent="space-between">
                    <ResponsiveText color="bg.500">
                      {`${curToSymbol(pm?.currency.code)}`}
                    </ResponsiveText>
                    <ResponsiveText color="bg.500">
                      {`${capitalize(pm?.en_name)}`}
                    </ResponsiveText>
                  </HStack>
                );
              })}
            </Box>
          </Grid>
        </Box>
      );
    }
  );
  return (
    <Box3D variant="extra_contrast" minH="20" mt="4" p="2">
      <Grid gridTemplateColumns="3fr 3fr 3fr 2fr">
        <ResponsiveText>Popular</ResponsiveText>
        <ResponsiveText>Buy</ResponsiveText>
        <ResponsiveText>Sell</ResponsiveText>
        <ResponsiveText>Bank</ResponsiveText>
      </Grid>
      {miniTable}
    </Box3D>
  );
};

export default Popular;
