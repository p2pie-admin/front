import { Box, Divider, HStack, Icon } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import { ResponsiveText } from "../../../../styles/theme/custom";

export function CustomHeader({ text, Icon }: { text: string; Icon: IconType }) {
  return (
    <HStack color="peach.200">
      <Icon size="2rem" />
      <ResponsiveText size="xl" fontWeight="bold" variant="primary">
        {text}
      </ResponsiveText>
    </HStack>
  );
}

export function ReviewBorder({ children }: { children: any }) {
  return (
    <Box
      position="relative"
      zIndex={2}
      borderRadius="xl"
      p="4"
      minW="50%"
      bgColor="bg.900"
      boxShadow="lg"
    >
      {children}
    </Box>
  );
}

export const FormatedDate = ({ updatedAt }: { updatedAt?: string | null }) => {
  const formattedDate = updatedAt
    ? new Intl.DateTimeFormat("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(updatedAt))
    : "";
  return (
    <ResponsiveText color="bg.500" size="sm">
      {" "}
      {formattedDate}{" "}
    </ResponsiveText>
  );
};
