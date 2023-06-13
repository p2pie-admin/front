import { ICitiesList } from "../../../../../types/shared";

export const formatCities = (
  languageIndex: number,
  citiCodes: string[],
  cityList: ICitiesList
) => {
  //  "MSCW/SPB/..." ----> "Russia" : { "Saint-Petersburg", "Moscow"}

  return citiCodes.reduce(
    (accumulator: { [key: string]: string[] }, cityCode: string) => {
      let [city, country] = cityList[cityCode]
        ? cityList[cityCode][languageIndex].split(",")
        : [null, null];
      if (city && country) {
        country = country.replace(" ", "");
        accumulator[country] = accumulator[country]
          ? [...accumulator[country], city]
          : [city];
      }
      return accumulator;
    },
    {}
  );
};
