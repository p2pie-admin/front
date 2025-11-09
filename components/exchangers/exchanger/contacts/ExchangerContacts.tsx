import { Button, HStack, Wrap, WrapItem } from "@chakra-ui/react";
import React from "react";
import { IExchangerCard } from "../../../../types/exchanger";
import { FaTelegramPlane, FaWhatsapp, FaPhone } from "react-icons/fa";
import { IoMailOpenSharp } from "react-icons/io5";
import { formatPhoneNumber } from "../description/helper";

export default function ExchangerContacts({
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
    <Wrap justify="flex-end" spacing="20px">
      <WrapItem>
        <Button
          leftIcon={<FaTelegramPlane size="1rem" />}
          variant="outline"
          colorScheme="blue"
        >
          Telegram
        </Button>
      </WrapItem>
      <WrapItem>
        <Button
          leftIcon={<FaWhatsapp size="1rem" />}
          variant="outline"
          colorScheme="green"
        >
          WhatsApp
        </Button>
      </WrapItem>
      <WrapItem>
        {phone_number && (
          <Button
            leftIcon={<FaPhone size="1rem" />}
            variant="outline"
            colorScheme="purple"
          >
            {formatPhoneNumber(phone_number)}
          </Button>
        )}
      </WrapItem>
      <WrapItem>
        {email && (
          <Button
            leftIcon={<IoMailOpenSharp size="1rem" />}
            variant="outline"
            colorScheme="orange"
          >
            {email}
          </Button>
        )}
      </WrapItem>
    </Wrap>
  );
}
