import type { NextApiRequest, NextApiResponse } from "next";
import { createHash } from "crypto";
import {
  POW_CHALLENGE_TTL_MS,
  ReviewPowChallenge,
  createPowPayload,
  hashMeetsDifficulty,
} from "../../components/exchangers/exchanger/leaveReview/helper";
import { serverLinkPROD } from "../../services/utils";

type ReviewPayload = {
  value: string;
  honeypot: string;
};

type SubmitRequestBody = {
  challenge: ReviewPowChallenge;
  nonce: number;
  review: ReviewPayload;
};

type SubmitResponse = {
  success: boolean;
  error?: string;
};

const FORWARD_PATH = "/createReview";

const getExternalUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return `${serverLinkPROD}${FORWARD_PATH}`;
  }
  return `http://localhost:5000${FORWARD_PATH}`;
};

const validateBody = (body: any): body is SubmitRequestBody => {
  if (!body || typeof body !== "object") return false;
  const { challenge, nonce, review } = body;
  if (
    !challenge ||
    typeof challenge.exchangerId !== "string" ||
    typeof challenge.salt !== "string" ||
    typeof challenge.issuedAt !== "number"
  ) {
    return false;
  }
  if (typeof nonce !== "number" || Number.isNaN(nonce)) {
    return false;
  }
  if (
    !review ||
    typeof review.value !== "string" ||
    typeof review.honeypot !== "string"
  ) {
    return false;
  }
  return true;
};

const verifyProofOfWork = (challenge: ReviewPowChallenge, nonce: number) => {
  if (Date.now() - challenge.issuedAt > POW_CHALLENGE_TTL_MS) {
    return { isValid: false, error: "Challenge expired" } as const;
  }
  const payload = `${createPowPayload(challenge)}:${nonce}`;
  const hashBytes = new Uint8Array(createHash("sha256").update(payload).digest());
  const isValid = hashMeetsDifficulty(hashBytes);
  if (!isValid) {
    return { isValid: false, error: "Invalid proof-of-work" } as const;
  }
  return { isValid: true } as const;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubmitResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  if (!validateBody(req.body)) {
    return res.status(400).json({ success: false, error: "Invalid payload" });
  }

  const { challenge, nonce, review } = req.body;

  const powResult = verifyProofOfWork(challenge, nonce);
  if (!powResult.isValid) {
    return res.status(400).json({ success: false, error: powResult.error });
  }

  try {
    const forwardResponse = await fetch(getExternalUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });

    if (!forwardResponse.ok) {
      return res
        .status(forwardResponse.status)
        .json({ success: false, error: "External service rejected review" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to forward review", error);
    return res.status(500).json({ success: false, error: "Forwarding failed" });
  }
}
