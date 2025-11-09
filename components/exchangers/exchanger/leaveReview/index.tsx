import { Button, Divider, HStack, Text, Textarea } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import { RiChatNewFill } from "react-icons/ri";
import { CustomHeader } from "../shared";
import { serverLinkPROD } from "../../../../services/utils";
import { MdOutlineDone } from "react-icons/md";
import { LuSend } from "react-icons/lu";
import { LuTriangleAlert } from "react-icons/lu";
export const LEAVE_REVIEW_SECTION_ID = "leave-review-section";

export default function LeaveReview({ exchangerId }: { exchangerId: string }) {
  const [value, setValue] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const storageKey = useMemo(
    () => `exchanger:${exchangerId}:review_sent`,
    [exchangerId]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(storageKey);
    setHasSubmitted(stored === "true");
  }, [storageKey]);

  const leaveReview = async () => {
    if (!value.trim() || hasSubmitted || isSending) return;
    try {
      setIsSending(true);
      const response = await fetch(
        process.env.NODE_ENV == "production"
          ? serverLinkPROD
          : "http://localhost:5000/createReview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: value }),
        }
      );
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, "true");
      }
      setHasSubmitted(true);
      setValue("");
    } catch (error) {
      console.error("Failed to send review", error);
    } finally {
      setIsSending(false);
    }
  };

  const isSubmitDisabled =
    value.trim().length < 10 || hasSubmitted || isSending;

  return (
    <Box3D
      my="8"
      p="4"
      variant="no_contrast"
      w="100%"
      id={LEAVE_REVIEW_SECTION_ID}
    >
      <CustomHeader text={"Оставить отзыв"} Icon={RiChatNewFill} />

      <Textarea
        mt="8"
        placeholder="Ваш отзыв"
        value={value}
        minH="100px"
        onChange={(e) => setValue(e.target.value)}
        isDisabled={hasSubmitted}
        borderWidth="2px"
        borderRadius="xl"
        borderColor="bg.500"
        focusBorderColor="peach.200"
      />

      <HStack justifyContent="space-between" spacing="4" mt="4">
        <HStack color="bg.400" ml="2">
          <LuTriangleAlert size="0.8rem" />
          <ResponsiveText size="sm" color="inherit">
            Запрещены мат, оскорбления и публикация личных данных
          </ResponsiveText>
        </HStack>
        <Button
          disabled={isSubmitDisabled}
          variant={isSubmitDisabled ? "unset" : "primary"}
          onClick={leaveReview}
          rightIcon={
            hasSubmitted ? (
              <MdOutlineDone size="1rem" />
            ) : (
              <LuSend size="1rem" />
            )
          }
        >
          {hasSubmitted
            ? "Отправлено"
            : isSending
            ? "Отправляем..."
            : "Отправить"}
        </Button>
      </HStack>
    </Box3D>
  );
}
