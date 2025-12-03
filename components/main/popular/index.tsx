import { IPopularDirRates } from "../../../types/rates";
import { IPm } from "../../../types/selector";

import CryptoRates from "./CryptoRates";
import { Box, Grid } from "@chakra-ui/react";
import CryptoPm from "./CryptoPm";
import { Box3D, ResponsiveText } from "../../../styles/theme/custom";
import { useTranslation } from "next-i18next";
import Shader from "../../shared/Shader";

const Popular = ({
  popularRates,
  popularPms,
}: {
  popularRates?: IPopularDirRates;
  popularPms?: IPm[];
}) => {
  const { t } = useTranslation();

  if (!popularRates || !popularPms) return <></>;

  return (
    <Box position="relative" overflow="hidden">
      <Box maxH="400" overflowY="auto">
        {Object.entries(popularRates).map(([cryptoCode, buySell], index) => {
          const cryptoPm = popularPms?.find((pm) => pm?.code == cryptoCode);
          if (!cryptoPm) return null; // ✅ Changed from <></> to null
          return (
            <Box3D
              key={cryptoCode} // Use cryptoCode as the unique key
              variant="extra_contrast"
              p="2"
              position="relative"
            >
              <Grid
                gridTemplateColumns="auto 1fr 1fr"
                gridGap="2"
                alignItems="center"
                color="bg.200"
                pl="1"
              >
                <CryptoPm cryptoPm={cryptoPm} />

                <ResponsiveText size="sm" fontWeight="bold">
                  {`${t("main:toBuy")} ${cryptoPm.currency.code.toUpperCase()}`}
                </ResponsiveText>
                <ResponsiveText size="sm" fontWeight="bold">
                  {`${t(
                    "main:toSell"
                  )} ${cryptoPm.currency.code.toUpperCase()}`}
                </ResponsiveText>
                <CryptoRates
                  key={cryptoCode}
                  popularPms={popularPms}
                  cryptoPm={cryptoPm}
                  buySell={buySell}
                />
              </Grid>
            </Box3D>
          );
        })}
        <Box h="50" />
      </Box>

      <Shader direction="top" no_contrast />
    </Box>
  );
};

export default Popular;
