import { IPhysicalExchanger, IPhysicalRate } from "../../types/exchanger";

export const testMarkers = [
  {
    id: 1,
    name: "Chicago, Illinois",
    position: { lat: 41.081832, lng: 28.9623177 },
  },
  {
    id: 2,
    name: "Denver, Colorado",
    position: { lat: 41.021832, lng: 28.9023177 },
  },
  {
    id: 3,
    name: "Los Angeles, California",
    position: { lat: 41.121832, lng: 28.8923177 },
  },
  {
    id: 4,
    name: "New York, New York",
    position: { lat: 41.481832, lng: 28.8623177 },
  },
  {
    id: 5,
    name: "New York",
    position: { lat: 41.071832, lng: 28.9323177 },
  },
  {
    id: 6,
    name: "New York",
    position: { lat: 41.061832, lng: 28.9223177 },
  },
  {
    id: 7,
    name: "Los Angeles, California",
    position: { lat: 41.125932, lng: 28.8683177 },
  },
  {
    id: 8,
    name: "Los Angeles, California",
    position: { lat: 41.121632, lng: 28.8673177 },
  },
  {
    id: 9,
    name: "Los Angeles, California",
    position: { lat: 41.123732, lng: 28.8653177 },
  },
];

export const getPricesUSD = (
  physicalExchangers: IPhysicalExchanger[]
): [number, number] => {
  if (!physicalExchangers?.length) {
    return [0, 0];
  }

  const prices = physicalExchangers
    .map((exchanger) =>
      !exchanger.opened
        ? 0
        : exchanger.physical_rates?.find(
            (r) => r.currency?.code.toUpperCase() === "USD"
          )?.selling || 0
    )
    .filter((i) => i !== 0);

  if (!prices.length) {
    return [0, 0];
  }

  return [Math.max(...prices), Math.min(...prices)];
};

export const getDollars = (
  priceBasis: [number, number],
  physicalExchanger: IPhysicalExchanger
) => {
  const buyPriceUSD = !physicalExchanger.opened
    ? 0
    : physicalExchanger?.physical_rates?.find(
        (r) => r.currency?.code.toUpperCase() === "USD"
      )?.selling;

  if (!buyPriceUSD) return 0;
  const [bestPriceUSD, worstPriceUSD] = priceBasis;
  const difference = (bestPriceUSD - worstPriceUSD) / 3;
  return buyPriceUSD > worstPriceUSD + difference * 2
    ? 1
    : buyPriceUSD > worstPriceUSD + difference
    ? 2
    : 3;
};
// const getUSDStats = (physicalExchangers: IPhysicalExchanger[]): {[key: string]: number} => {
//   return physicalExchangers.reduce((rateStats, exchanger) => {
//     const rates = exchanger.physical_rates
//     if(!rates) return rateStats

//     // const buyPrices = rates.reduce((buyPrices, {selling, currency}) => {
//     //   if(!currency) return buyPrices
//     //   return {...buyPrices, [currency.code]: selling}
//     // } , {} as {[key: string]: number})

//     // if(!Object.keys(rateStats).length) return rates
//     // Object.keys(rates).map(code => {
//     //   if(rateStats[code])
//     // })

//     return {...rateStats, }
//   }, {})
// }
