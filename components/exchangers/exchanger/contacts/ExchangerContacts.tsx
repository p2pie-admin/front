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
    <Wrap justify={{ lg: "flex-end", base: "flex" }} spacing="20px" px="4">
      <WrapItem>
        <Button
          leftIcon={<FaTelegramPlane size="1rem" />}
          variant="outline"
          colorScheme="blue"
          size={{ lg: "md", base: "xs" }}
        >
          Telegram
        </Button>
      </WrapItem>
      <WrapItem>
        <Button
          leftIcon={<FaWhatsapp size="1rem" />}
          variant="outline"
          colorScheme="green"
          size={{ lg: "md", base: "xs" }}
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
            size={{ lg: "md", base: "xs" }}
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
            size={{ lg: "md", base: "xs" }}
          >
            {email}
          </Button>
        )}
      </WrapItem>
    </Wrap>
  );
}
