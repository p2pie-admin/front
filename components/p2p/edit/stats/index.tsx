import { Box, Divider, Flex, HStack, VStack } from "@chakra-ui/react";
import { IMaker } from "../../../../types/p2p";
import { FormatedDate } from "../../../shared/BoxWrapper";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import StatItem from "./StatItem";
import { FaListUl, FaRegHandshake } from "react-icons/fa6";
import { TbPencil } from "react-icons/tb";
import { MdOutlineDateRange } from "react-icons/md";
import { RiExchange2Line } from "react-icons/ri";
import MakerRating from "./MakerRating";
import { FaCheck } from "react-icons/fa6";
import { FaXmark } from "react-icons/fa6";
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

  const level = maker.p2p_level;
  const conditions = Array.isArray(level?.conditions) ? level?.conditions : [];

  const completed = maker.p2p_level?.conditions?.filter(
    (c) => c.is_completed,
  )?.length;
  const total = maker.p2p_level?.conditions?.length;

  return (
    <HStack alignItems="start">
      <MakerRating
        completed={completed}
        total={total}
        level={maker.p2p_level?.level || 1}
      />
      <Divider mt="2" orientation="vertical" h="80px" mx="2" />
      <Box w="fit-content" mt="2">
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
      <Divider mt="2" orientation="vertical" h="80px" mx="2" />
      <VStack w="100%" mt="2" spacing="1" alignItems="start">
        <ResponsiveText size="sm" mb="2" ml="2" color="bg.400">
          Для перехода на следующий уровень необходимо:
        </ResponsiveText>
        {conditions.map((c) => (
          <Box3D
            cursor="pointer"
            key={c.description}
            py="1"
            px="2"
            w="100%"
            variant={c.is_completed ? "contrast" : "extra_contrast"}
            color={c.is_completed ? "green.300" : "red.300"}
          >
            <HStack w="100%" justifyContent="space-between">
              <ResponsiveText
                size="sm"
                color={c.is_completed ? "bg.400" : "bg.200"}
              >
                {c.description}
              </ResponsiveText>
              {c.is_completed ? (
                <FaCheck size="1rem" />
              ) : (
                <FaXmark size="1rem" />
              )}
            </HStack>
          </Box3D>
        ))}
      </VStack>
    </HStack>
  );
}
