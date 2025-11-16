import { Button, HStack, Input, Text, VStack, Wrap } from "@chakra-ui/react";
import React from "react";
import { useAppDispatch } from "../../../../../redux/hooks";
import { triggerModal } from "../../../../../redux/mainReducer";
import { ResponsiveText } from "../../../../../styles/theme/custom";
import { IReviewCategory } from "../../../../../types/exchanger";
import useSWR from "swr";
import { initCMSFetcher } from "../../../../../services/fetchers";
import { exchangerReviewCategoriesQuery } from "../../../../../services/queries";
import ErrorWrapper from "../../../../shared/ErrorWrapper";
import ReviewCategory from "./ReviewCategory";
import ReviewCategories from "./ReviewCategories";

type ReviewAddonsProps = {
  onClose?: () => void;
  sentiment: "positive" | "neutral" | "negative" | null;
  selectedCategoryIds: string[];
  onToggleCategory: (id?: string) => void;
};

const hints = [
  "Номер заявки",
  "Сумма",
  "Если есть переписки или чеки, приложите их фотографией",
];

export default function ReviewAddons({
  onClose,
  sentiment,
  selectedCategoryIds,
  onToggleCategory,
}: ReviewAddonsProps) {
  const fetcher = initCMSFetcher();

  const { data, error } = useSWR(exchangerReviewCategoriesQuery, fetcher) as {
    data: IReviewCategory[];
    error: any;
  };

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
      <VStack align="stretch" spacing="2" minH="300">
        <ErrorWrapper isLoading={!data} isError={!!error}>
          <ReviewCategories
            categories={data}
            sentiment={sentiment}
            selectedIds={selectedCategoryIds}
            onToggle={onToggleCategory}
          />
        </ErrorWrapper>
      </VStack>

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
