import { IPopularDirRates } from "../../../types/rates";
import { IPm } from "../../../types/selector";

import CryptoRates from "./CryptoRates";
import { Box, Divider, Grid, Text, useColorModeValue } from "@chakra-ui/react";
import CryptoPm from "./CryptoPm";
import { ResponsiveText } from "../../../styles/theme/custom";

const Popular = ({
  popularRates,
  popularPms,
}: {
  popularRates?: IPopularDirRates;
  popularPms?: IPm[];
}) => {
  const borderColor = useColorModeValue("bg.200", "bg.600");
  if (!popularRates || !popularPms) return <></>;

  return (
    <Grid
      gridTemplateColumns="auto 1fr 1fr"
      gridGap="2"
      alignItems="center"
      color="bg.200"
    >
      {Object.entries(popularRates).map(([cryptoCode, buySell], index) => {
        const cryptoPm = popularPms.find((pm) => pm.code == cryptoCode);
        if (!cryptoPm) return <></>;
        return (
          <>
            <Box h="1px" bgColor={borderColor} gridColumn="1/4" />
            <Box>
              <CryptoPm cryptoPm={cryptoPm} />
            </Box>
            <ResponsiveText size="sm" fontWeight="bold" textAlign="end">
              Покупка
            </ResponsiveText>
            <ResponsiveText size="sm" fontWeight="bold" textAlign="end">
              Продажа
            </ResponsiveText>
            <CryptoRates
              key={index + "cr"}
              popularPms={popularPms}
              cryptoPm={cryptoPm}
              buySell={buySell}
            />
          </>
        );
      })}
    </Grid>
  );
};

export default Popular;
