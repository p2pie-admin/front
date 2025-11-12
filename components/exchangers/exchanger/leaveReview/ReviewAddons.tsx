import { Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { useAppDispatch } from "../../../../redux/hooks";
import { triggerModal } from "../../../../redux/mainReducer";
import { ResponsiveText } from "../../../../styles/theme/custom";

type ReviewAddonsProps = {
  onClose?: () => void;
};

const hints = [
  "Номер заявки",
  "Сумма",
  "Если есть переписки или чеки, приложите их фотографией",
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
      <Text>
        Не терпится получить обратную связь? Обсудите ваше впечатление от
        обменника в чате телегам
      </Text>

      <Text>
        Ваш отзыв получит галочку подтверждения, если вы дабавите следующую
        информацию:
      </Text>
      <VStack align="stretch" spacing="2">
        {hints.map((hint) => (
          <Input
            placeholder={hint}
            borderWidth="2px"
            borderRadius="xl"
            borderColor="bg.500"
            size="md"
            h="45px"
            focusBorderColor="peach.200"
          />
        ))}
      </VStack>
      <HStack w="100%" justifyContent={"end"}>
        <Button
          alignSelf="flex-end"
          variant="no_contrast"
          onClick={handleClose}
        >
          Пропустить
        </Button>
        <Button alignSelf="flex-end" variant="primary" onClick={handleClose}>
          Отправить
        </Button>
      </HStack>
    </VStack>
  );
}
