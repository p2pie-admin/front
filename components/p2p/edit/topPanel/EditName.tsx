import React, { ChangeEvent, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
import { MdModeEdit } from "react-icons/md";
import CustomModal from "../../../shared/CustomModal";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  setMakerTelegramName,
  triggerModal,
} from "../../../../redux/mainReducer";
import { useMakerEditContext } from "../MakerEditContext";
import { useT } from "../../../../services/i18n";

export default function EditName() {
  const maker = useMakerEditContext();
  const dispatch = useAppDispatch();
  const t = useT();
  const modalId = `edit_name_${maker.id}`;

  const reduxName = useAppSelector((state) => state.main.maker?.telegram_name);

  useEffect(() => {
    if (reduxName === undefined && maker.telegram_name !== undefined) {
      dispatch(setMakerTelegramName(maker.telegram_name));
    }
  }, [
    dispatch,
    maker.telegram_name,
    reduxName,
  ]);

  const nameValue = reduxName ?? "";

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setMakerTelegramName(event.target.value));
  };


  return (
    <>
      <CustomModal id={modalId} header={t("Редактировать имя", "Edit name")}>
        <VStack align="stretch" spacing="4" p="6">
          <FormControl>
            <FormLabel>{t("Имя", "Name")}</FormLabel>
            <Input
              value={nameValue}
              onChange={handleNameChange}
              placeholder={t("Введите имя", "Enter a name")}
            />
            <FormHelperText>
              {t("Имя видят все. Оно не должно совпадать с вашим Telegram-ником: ник знает только бот p2pie.", "Everyone sees the name. It must not match your Telegram username: only the p2pie bot knows the username.")}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Telegram</FormLabel>
            {/* Literal mask: the username is never sent to the browser. */}
            <Input value="@*****" isReadOnly />
          </FormControl>
          <HStack justifyContent="flex-end">
            <Button
              variant="primary"
              onClick={() => dispatch(triggerModal(undefined))}
            >
              {t("Готово", "Done")}
            </Button>
          </HStack>
        </VStack>
      </CustomModal>

      <Box
        cursor="pointer"
        filter=" brightness(0.8)"
        onClick={() => dispatch(triggerModal(modalId))}
        _hover={{ filter: " brightness(1.1)" }}
      >
        <MdModeEdit size="1.2rem" />
      </Box>
    </>
  );
}
