import { Button, Divider, VStack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ICity } from "../../../types/exchange";
import { BoxWrapper, CustomHeader } from "../../shared/BoxWrapper";
import { ClosestCityMatch } from "../helper";
import { TbMapSearch } from "react-icons/tb";
import { ResponsiveText } from "../../../styles/theme/custom";

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
        {closestCities.map(({ city: target, slug, distanceKm }) => (
          <Button
            as={Link}
            href={`/map/${slug}`}
            key={slug}
            justifyContent="space-between"
            variant="ghost"
            color="bg.300"
          >
            <ResponsiveText>{`Обмен наличных в ${getCityName(
              target
            )}`}</ResponsiveText>
            <ResponsiveText>{formatDistance(distanceKm, isRu)}</ResponsiveText>
          </Button>
        ))}
      </VStack>
    </BoxWrapper>
  );
};

export default ClosestCities;
