import React, { ChangeEvent, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
import { MdOutlineEdit } from "react-icons/md";
import CustomModal from "../../../shared/CustomModal";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  setMakerTelegramName,
  setMakerTelegramUsername,
  triggerModal,
} from "../../../../redux/mainReducer";
import { IMaker } from "../../../../types/p2p";

export default function EditName({ maker }: { maker: IMaker }) {
  const dispatch = useAppDispatch();
  const modalId = `edit_name_${maker.id}`;

  const reduxName = useAppSelector((state) => state.main.maker?.telegram_name);
  const reduxUsername = useAppSelector(
    (state) => state.main.maker?.telegram_username,
  );

  useEffect(() => {
    if (reduxName === undefined && maker.telegram_name !== undefined) {
      dispatch(setMakerTelegramName(maker.telegram_name));
    }
    if (
      reduxUsername === undefined &&
      maker.telegram_username !== undefined
    ) {
      dispatch(setMakerTelegramUsername(maker.telegram_username));
    }
  }, [
    dispatch,
    maker.telegram_name,
    maker.telegram_username,
    reduxName,
    reduxUsername,
  ]);

  const nameValue = reduxName ?? "";
  const usernameValue = reduxUsername ?? "";

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setMakerTelegramName(event.target.value));
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setMakerTelegramUsername(event.target.value));
  };

  return (
    <>
      <CustomModal id={modalId} header="Редактировать имя">
        <VStack align="stretch" spacing="4" p="6">
          <FormControl>
            <FormLabel>Имя</FormLabel>
            <Input
              value={nameValue}
              onChange={handleNameChange}
              placeholder="Введите имя"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Telegram username</FormLabel>
            <Input
              value={usernameValue}
              onChange={handleUsernameChange}
              placeholder="@username"
            />
          </FormControl>
          <HStack justifyContent="flex-end">
            <Button
              variant="primary"
              onClick={() => dispatch(triggerModal(undefined))}
            >
              Готово
            </Button>
          </HStack>
        </VStack>
      </CustomModal>
      <Button
        variant="no_contrast"
        onClick={() => dispatch(triggerModal(modalId))}
      >
        <MdOutlineEdit size="1.2rem" />
      </Button>
    </>
  );
}
