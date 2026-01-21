import { Divider, Flex } from "@chakra-ui/react";
import { IMaker } from "../../../../types/p2p";
import { FormatedDate } from "../../../shared/BoxWrapper";
import { ResponsiveText } from "../../../../styles/theme/custom";
import StatItem from "./StatItem";

export default function MakerStats({ maker }: { maker: IMaker }) {
  const offers = Array.isArray(maker.offers) ? maker.offers : null;
  const reviews = Array.isArray(maker.reviews) ? maker.reviews : null;
  const offersCount = offers ? offers.length : null;
  const activeOffersCount = offers
    ? offers.filter((offer) => offer?.isActive).length
    : null;
  const reviewsCount = reviews ? reviews.length : null;

  return (
    <Flex
      flexDir={{ base: "column", lg: "row" }}
      color="bg.200"
      justifyContent="space-between"
      w="100%"
      gap="4"
      px="2"
    >
      <StatItem label="Предложений" value={offersCount} />
      <ResponsiveText display={{ base: "none", lg: "flex" }} variant="shaded">
        •
      </ResponsiveText>
      <StatItem label="Сделок" value={0} />
      <ResponsiveText display={{ base: "none", lg: "flex" }} variant="shaded">
        •
      </ResponsiveText>
      <StatItem label="Отзывов" value={reviewsCount} />
      <ResponsiveText display={{ base: "none", lg: "flex" }} variant="shaded">
        •
      </ResponsiveText>

      <StatItem
        label="Создан"
        value={<FormatedDate updatedAt={maker.createdAt} />}
      />
    </Flex>
  );
}
