import { Button, HStack } from "@chakra-ui/react";
import React from "react";
import { IExchangerCard } from "../../../../types/exchanger";
import { FaTelegramPlane, FaWhatsapp, FaPhone } from "react-icons/fa";
import { IoMailOpenSharp } from "react-icons/io5";
import { formatPhoneNumber } from "./helper";

export default function ExchangerSocials({
  exchangerCard,
}: {
  exchangerCard?: IExchangerCard | null;
}) {
  if (!exchangerCard) return <></>;
  const {
    date_listed,
    email,
    phone_number,
    telegram,
    whatsapp,
    total_reserve_usd,
  } = exchangerCard;

  return (
    <HStack mt="4">
      <Button
        leftIcon={<FaTelegramPlane size="1rem" />}
        variant="outline"
        colorScheme="blue"
      >
        Telegram
      </Button>
      <Button
        leftIcon={<FaWhatsapp size="1rem" />}
        variant="outline"
        colorScheme="green"
      >
        WhatsApp
      </Button>
      {phone_number && (
        <Button
          leftIcon={<FaPhone size="1rem" />}
          variant="outline"
          colorScheme="purple"
        >
          {formatPhoneNumber(phone_number)}
        </Button>
      )}
      {email && (
        <Button
          leftIcon={<IoMailOpenSharp size="1rem" />}
          variant="outline"
          colorScheme="orange"
        >
          {email}
        </Button>
      )}
    </HStack>
  );
}
