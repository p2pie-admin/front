import {
  Grid,
  Button,
  Box,
  Text,
  Tooltip,
  Textarea,
  HStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { HiReply } from "react-icons/hi";
import CustomModal from "../../../shared/CustomModal";
import { useAppDispatch } from "../../../../redux/hooks";
import { triggerModal } from "../../../../redux/mainReducer";

export default function ReviewText({ text }: { text?: string | null }) {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const handleClose = () => {
    dispatch(triggerModal(undefined));
  };

  const handleSend = () => {
    dispatch(triggerModal(undefined));
  };

  const handleSubmitClick = () => {
    dispatch(triggerModal("reply"));
  };

  return (
    <Grid gridTemplateColumns="1fr 40px" mt="4">
      <Text whiteSpace="pre-wrap" mt="2">
        {text}
      </Text>
      <Tooltip openDelay={500} label={"Ответить"} fontSize="sm">
        <Button size="xs" variant="ghost" onClick={handleSubmitClick}>
          <Box transform="rotate(180deg) scaleX(-1)" color="bg.300">
            <HiReply size="1rem" />
          </Box>
        </Button>

        <CustomModal id={"reply"} header={"Ответить на отзыв"}>
          <Box>
            <Textarea
              placeholder="Ваш комментарий"
              minH="100px"
              borderWidth="2px"
              borderRadius="xl"
              borderColor="peach.500"
              focusBorderColor="peach.200"
            />
            <HStack w="100%" justifyContent={"end"} mt="4">
              <Button
                alignSelf="flex-end"
                variant="no_contrast"
                onClick={handleClose}
              >
                Отмена
              </Button>
              <Button
                alignSelf="flex-end"
                variant="primary"
                onClick={handleSend}
              >
                Отправить
              </Button>
            </HStack>
          </Box>
        </CustomModal>
      </Tooltip>
    </Grid>
  );
}
