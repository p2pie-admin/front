import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

import { RiDeleteBin2Fill } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { removeP2PDirection } from "../../../../../redux/mainReducer";
import { useLocale, useT } from "../../../../../services/i18n";
import { IPm } from "../../../../../types/selector";

// Delete button of an offer row: asks for confirmation in a dialog before removing the direction.
export default function DeleteOffer({
  index,
  isFull,
}: {
  index: number;
  isFull?: boolean;
}) {
  const dispatch = useAppDispatch();
  const t = useT();
  const locale = useLocale();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const offer = useAppSelector((state) => state.main.p2pFullOffers[index]);
  const pmName = (pm?: IPm | null) => (locale === "en" ? pm?.en_name : pm?.ru_name) || pm?.en_name || "";
  const give = pmName(offer?.givePm);
  const get = pmName(offer?.getPm);
  const direction = give && get ? `${give} → ${get}` : "";

  const open = (event: React.MouseEvent) => {
    event.stopPropagation();
    onOpen();
  };

  const confirm = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClose();
    dispatch(removeP2PDirection(index));
  };

  return (
    <>
      <Button
        onClick={open}
        variant={isFull ? "no_contrast" : "ghost"}
        w={isFull ? { base: "100%", lg: "auto" } : undefined}
        justifyContent={isFull ? { base: "center", lg: "flex-start" } : undefined}
        aria-label={t("Удалить предложение", "Delete offer")}
      >
        {isFull ? (
          <HStack
            spacing="2"
            justifyContent={{ base: "center", lg: "flex-start" }}
            w={{ base: "100%", lg: "auto" }}
          >
            <RiDeleteBin2Fill size="1.2rem" />
            <Text display={{ base: "inline", lg: "none" }}>{t("Удалить", "Delete")}</Text>
          </HStack>
        ) : (
          <RiDeleteBin2Fill size="1.2rem" />
        )}
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent bg="bg.800" color="bg.200" mx="4" onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("Удалить предложение?", "Delete the offer?")}
            </AlertDialogHeader>
            <AlertDialogBody color="bg.300">
              {direction ? (
                <Text fontWeight="bold" color="bg.200" mb="2">
                  {direction}
                </Text>
              ) : null}
              {t(
                "Направление исчезнет с вашей страницы после нажатия «Опубликовать».",
                "The direction disappears from your page after you press «Publish».",
              )}
            </AlertDialogBody>
            <AlertDialogFooter gap="3">
              <Button ref={cancelRef} variant="no_contrast" onClick={onClose}>
                {t("Отмена", "Cancel")}
              </Button>
              <Button colorScheme="red" leftIcon={<RiDeleteBin2Fill />} onClick={confirm}>
                {t("Удалить", "Delete")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
