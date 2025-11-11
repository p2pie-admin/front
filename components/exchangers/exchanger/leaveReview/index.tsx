import { Button, Divider, HStack, Input, Textarea } from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import { RiChatNewFill } from "react-icons/ri";
import { CustomHeader } from "../shared";
import {
  MdOutlineDone,
  MdOutlineSentimentNeutral,
  MdSentimentSatisfiedAlt,
  MdSentimentVeryDissatisfied,
} from "react-icons/md";
import { LuSend } from "react-icons/lu";
import { LuTriangleAlert } from "react-icons/lu";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { sendToast, triggerModal } from "../../../../redux/mainReducer";
import CustomModal from "../../../shared/CustomModal";
import ReviewAddons from "./ReviewAddons";
import { ReviewPowChallenge, solvePowChallenge } from "./helper";
import { IReview } from "../../../../types/exchanger";
import { $ } from "@upstash/redis/zmscore-DWj9Vh1g";
import { ICity } from "../../../../types/exchange";
import { locale } from "../../../../services/utils";
import { waitSec } from "../../../shared/helper";
export const LEAVE_REVIEW_SECTION_ID = "leave-review-section";
const REVIEW_COOLDOWN_MS = 60 * 60 * 1000;

const sentimentOptions = [
  {
    value: "positive",
    label: "Positive",
    icon: MdSentimentSatisfiedAlt,
    iconColor: "green.300",
  },
  {
    value: "neutral",
    label: "Neutral",
    icon: MdOutlineSentimentNeutral,
    iconColor: "gray.300",
  },
  {
    value: "negative",
    label: "Negative",
    icon: MdSentimentVeryDissatisfied,
    iconColor: "red.300",
  },
] as const;

type SentimentValue = (typeof sentimentOptions)[number]["value"];

export default function LeaveReview({ exchangerId }: { exchangerId: string }) {
  const dispatch = useAppDispatch();
  const { fingerprintInfo, city } = useAppSelector((state) => ({
    fingerprintInfo: state.main.fingerprint,
    city: state.main.city as ICity,
  }));
  const loadTimeRef = useRef(Date.now());
  const [value, setValue] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentiment, setSentiment] = useState<SentimentValue | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const storageKey = useMemo(
    () => `exchanger:${exchangerId}:review_sent`,
    [exchangerId]
  );

  const lockReviewSubmission = useCallback(() => {
    const cooldownExpiresAt = Date.now() + REVIEW_COOLDOWN_MS;
    setCooldownUntil(cooldownExpiresAt);
    setHasSubmitted(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, `${cooldownExpiresAt}`);
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      setHasSubmitted(false);
      setCooldownUntil(null);
      return;
    }
    const expiresAt = Number(stored);
    if (!Number.isFinite(expiresAt)) {
      localStorage.removeItem(storageKey);
      setHasSubmitted(false);
      setCooldownUntil(null);
      return;
    }
    if (Date.now() < expiresAt) {
      setHasSubmitted(true);
      setCooldownUntil(expiresAt);
    } else {
      localStorage.removeItem(storageKey);
      setHasSubmitted(false);
      setCooldownUntil(null);
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !cooldownUntil) return;
    const remaining = cooldownUntil - Date.now();
    if (remaining <= 0) {
      setHasSubmitted(false);
      setCooldownUntil(null);
      localStorage.removeItem(storageKey);
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setHasSubmitted(false);
      setCooldownUntil(null);
      localStorage.removeItem(storageKey);
    }, remaining);
    return () => window.clearTimeout(timeoutId);
  }, [cooldownUntil, storageKey]);

  const determinePowDifficulty = () => {
    const elapsedMs = Date.now() - loadTimeRef.current;
    if (elapsedMs < 7000) return 30;
    if (elapsedMs < 15000) return 18;
    return 10;
  };

  const runProofOfWork = async (requestedDifficulty: number) => {
    const challengeResponse = await fetch(
      `/api/review-pow?exchangerId=${encodeURIComponent(
        exchangerId
      )}&complexity=${requestedDifficulty}`
    );
    if (!challengeResponse.ok) {
      throw new Error("Failed to request proof-of-work challenge");
    }
    const {
      challenge,
      difficulty: serverDifficulty,
    }: { challenge: ReviewPowChallenge; difficulty: number } =
      await challengeResponse.json();

    const effectiveDifficulty =
      challenge.difficulty ?? serverDifficulty ?? requestedDifficulty;
    const solution = await solvePowChallenge(challenge, effectiveDifficulty);

    return { challenge, nonce: solution.nonce };
  };

  const leaveReview = async () => {
    if (!value.trim() || hasSubmitted || isSending) return;
    try {
      dispatch(triggerModal(`review:${exchangerId}`));
      setIsSending(true);
      const powDifficulty = determinePowDifficulty();
      const proof = await runProofOfWork(powDifficulty);
      lockReviewSubmission();
      const reviewPayload: IReview = {
        honeypot,
        text: value,
        exchangerId,
        type: sentiment || undefined,
        isDispute: null,
        userAgent: fingerprintInfo?.userAgent,
        fingerprint: fingerprintInfo?.fingerprint,
        location: city?.[`${locale}_name`] || undefined,
      };
      await waitSec(1);
      const response = await fetch("/api/review-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challenge: proof.challenge,
          nonce: proof.nonce,
          review: reviewPayload,
        }),
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(
          errorBody?.error || `Request failed with status ${response.status}`
        );
      }
      console.info("Review submitted via Next.js proxy");
      setValue("");
      dispatch(
        sendToast({
          status: "success",
          title:
            "Спасибо за отзыв! После быстрой проверки он будет опубликован.",
        })
      );
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
      <HStack justifyContent="space-between" flexWrap="wrap" gap="3">
        <CustomHeader text={"Оставить отзыв"} Icon={RiChatNewFill} />
        <HStack spacing="2">
          {sentimentOptions.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant="ghost"
              borderWidth="2px"
              borderRadius="xl"
              borderColor={
                sentiment === option.value ? "bg.500" : "transparent"
              }
              bgColor={sentiment === option.value ? "bg.800" : "transparent"}
              color={option.iconColor}
              onClick={() => setSentiment(option.value)}
              isDisabled={hasSubmitted}
              _hover={{
                bgColor: sentiment === option.value ? "bg.700" : "bg.900",
              }}
            >
              <option.icon size="1.5rem" color={option.iconColor} />
            </Button>
          ))}
        </HStack>
      </HStack>
      <Divider my="4" />
      <Textarea
        placeholder="Ваш отзыв"
        value={value}
        minH="100px"
        onChange={(e) => setValue(e.target.value)}
        isDisabled={hasSubmitted}
        borderWidth="2px"
        borderRadius="xl"
        borderColor="peach.500"
        focusBorderColor="peach.200"
      />
      <CustomModal id={`review:${exchangerId}`} header={"Дополните отзыв"}>
        <ReviewAddons />
      </CustomModal>
      <HStack justifyContent="space-between" spacing="4" mt="4">
        <HStack color="bg.400" ml="2">
          <LuTriangleAlert size="0.8rem" />
          <ResponsiveText size="sm" color="inherit">
            Запрещены мат, оскорбления и публикация личных данных
          </ResponsiveText>
          <Input
            size="xs"
            w="1"
            variant="unstyled"
            value={""}
            onChange={(e: any) => setHoneypot(e.target.value)}
          />
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
