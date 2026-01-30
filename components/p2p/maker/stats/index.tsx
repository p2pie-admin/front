import { Box, Divider, Flex, HStack } from "@chakra-ui/react";
import { IMaker } from "../../../../types/p2p";
import { FormatedDate } from "../../../shared/BoxWrapper";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import StatItem from "./StatItem";
import { FaListUl, FaRegHandshake } from "react-icons/fa6";
import { TbPencil } from "react-icons/tb";
import { MdOutlineDateRange } from "react-icons/md";
import { RiExchange2Line } from "react-icons/ri";
import MakerRating from "./MakerRating";

export default function MakerStats({ maker }: { maker: IMaker }) {
  const offers = Array.isArray(maker.offers) ? maker.offers : null;
  const reviews = Array.isArray(maker.reviews) ? maker.reviews : null;
  const offersCount = offers ? offers.length : null;
  const activeOffersCount = offers
    ? offers.filter((offer) => offer?.isActive).length
    : null;
  const reviewsCount = reviews ? reviews.length : null;

  const formattedDate = maker.createdAt
    ? new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(maker.createdAt))
    : "";

  return (
    <HStack>
      <MakerRating value={maker.rating} />
      <Divider orientation="vertical" h="80px" mx="2" />
      <Box w="fit-content">
        <StatItem
          label="Предложений"
          value={offersCount}
          Icon={RiExchange2Line}
        />

        <StatItem label="Сделок" value={0} Icon={FaRegHandshake} />

        <StatItem label="Отзывов" value={reviewsCount} Icon={TbPencil} />

        <StatItem
          label="Создан"
          value={formattedDate}
          Icon={MdOutlineDateRange}
        />
      </Box>
    </HStack>
  );
}
