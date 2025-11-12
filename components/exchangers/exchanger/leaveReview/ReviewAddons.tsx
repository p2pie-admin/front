import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { useAppDispatch } from "../../../../redux/hooks";
import { triggerModal } from "../../../../redux/mainReducer";

type ReviewAddonsProps = {
  onClose?: () => void;
};

const hints = [
  "Укажите курсы, которые вы получили на деле",
  "Расскажите о скорости обмена и качестве поддержки",
  "Если есть переписки или чеки, приложите их ссылкой",
];

export default function ReviewAddons({ onClose }: ReviewAddonsProps) {
  const dispatch = useAppDispatch();
  const handleClose = () => {
    onClose?.();
    dispatch(triggerModal(undefined));
  };

  return (
    <VStack
      align="stretch"
      spacing="4"
      px={["3", "6"]}
      py="4"
      color="bg.200"
      fontSize="sm"
    >
      <Text color="bg.100" fontWeight="semibold">
        Добавьте к отзыву максимум деталей — так другим пользователям проще
        доверять вашей истории.
      </Text>
      <VStack align="stretch" spacing="2">
        {hints.map((hint) => (
          <HStack key={hint} spacing="3">
            <Text color="peach.300">•</Text>
            <Text>{hint}</Text>
          </HStack>
        ))}
      </VStack>
      <Button
        alignSelf="flex-end"
        variant="primary"
        size="sm"
        onClick={handleClose}
      >
        Продолжить
      </Button>
    </VStack>
  );
}
