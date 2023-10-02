import { Grid, Text } from "@chakra-ui/react";
import { IPhysicalExchanger, IPhysicalRate } from "../../../types/exchanger";

const PhysicalExchangerRates = ({ rates }: { rates?: IPhysicalRate[] }) => {
  return (
    <Grid
      p="2"
      color="bg.100"
      gridTemplateColumns="4fr auto 1fr auto"
      gridGap="2"
      justifyContent="center"
    >
      {rates &&
        rates.map(({ currency, id, selling, buying }) => {
          if (!currency?.code) return <></>;
          return (
            <>
              <Text key={id}>{currency.code.toUpperCase()}</Text>
              <Text color="green.200">{`₺${buying}`}</Text>
              <Text>|</Text>
              <Text color="red.200">{`₺${selling}`}</Text>
            </>
          );
        })}
    </Grid>
  );
};

export default PhysicalExchangerRates;
