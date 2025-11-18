import { Button, Divider, VStack, Text, HStack } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ICity } from "../../../types/exchange";
import { BoxWrapper, CustomHeader } from "../../shared/BoxWrapper";
import { ClosestCityMatch } from "../helper";
import { TbMapSearch } from "react-icons/tb";
import { ResponsiveText } from "../../../styles/theme/custom";
import { RiPinDistanceFill } from "react-icons/ri";

type ClosestCitiesProps = {
  city: ICity;
  closestCities: ClosestCityMatch[];
};

const formatDistance = (distanceKm: number, isRu: boolean) =>
  `${Math.round(distanceKm)} ${isRu ? "км" : "km"}`;

const ClosestCities = ({ city, closestCities }: ClosestCitiesProps) => {
  const { locale } = useRouter();
  const isRu = locale === "ru";

  if (!closestCities.length) {
    return null;
  }

  const heading = isRu ? `Города рядом` : `Cities near ${city.en_name}`;

  const getCityName = (target: ICity) =>
    isRu
      ? target.preposition || target.en_name
      : target.en_name || target.ru_name;

  return (
    <BoxWrapper mt="8">
      <CustomHeader text={heading} as="h3" Icon={TbMapSearch} />
      <Divider my="4" />
      <VStack align="stretch" spacing="3">
        {closestCities.map(({ city: target, slug, distanceKm, ratesTotal }) => {
          const cityName = getCityName(target);
          return (
            <Button
              as={Link}
              href={`/map/${slug}`}
              key={slug}
              justifyContent="space-between"
              variant="ghost"
              color="bg.300"
            >
              <HStack>
                <ResponsiveText fontWeight="thin">{`Обмен ${
                  cityName.startsWith("В") ? "во" : "в"
                }`}</ResponsiveText>
                <ResponsiveText variant="primary">{`${cityName}`}</ResponsiveText>
                <ResponsiveText
                  size="xs"
                  mt="1"
                  display={{ base: "none", lg: "unset" }}
                >{`(${ratesTotal} предложений)`}</ResponsiveText>
                {cityName.length < 12 && (
                  <ResponsiveText
                    size="xs"
                    mt="1"
                    display={{ base: "unset", lg: "none" }}
                  >{`(${ratesTotal})`}</ResponsiveText>
                )}
              </HStack>
              <HStack>
                <RiPinDistanceFill size="1.2rem" />
                <ResponsiveText>
                  {formatDistance(distanceKm, isRu)}
                </ResponsiveText>
              </HStack>
            </Button>
          );
        })}
      </VStack>
    </BoxWrapper>
  );
};

export default ClosestCities;
