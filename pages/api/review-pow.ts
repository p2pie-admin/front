import type { NextApiRequest, NextApiResponse } from "next";
import { createHash, randomBytes, randomUUID } from "crypto";
import {
  POW_DIFFICULTY,
  POW_CHALLENGE_TTL_MS,
  ReviewPowChallenge,
  createPowPayload,
  hashMeetsDifficulty,
} from "../../components/exchangers/exchanger/leaveReview/helper";

type PowGetResponse = {
  challenge: ReviewPowChallenge;
  difficulty: number;
};

type PowPostResponse = {
  success: boolean;
  error?: string;
};

const createSalt = () =>
  typeof randomUUID === "function"
    ? randomUUID()
    : randomBytes(16).toString("hex");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PowGetResponse | PowPostResponse>
) {
  if (req.method === "GET") {
    const exchangerId = req.query.exchangerId;
    if (!exchangerId || typeof exchangerId !== "string") {
      return res
        .status(400)
        .json({
          success: false,
          error: "exchangerId query param is required",
        } as PowPostResponse);
    }

    const challenge: ReviewPowChallenge = {
      exchangerId,
      salt: createSalt(),
      issuedAt: Date.now(),
    };

    return res.status(200).json({ challenge, difficulty: POW_DIFFICULTY });
  }

  if (req.method === "POST") {
    const { challenge, nonce } = req.body ?? {};
    if (
      !challenge ||
      typeof challenge.exchangerId !== "string" ||
      typeof challenge.salt !== "string" ||
      typeof challenge.issuedAt !== "number" ||
      typeof nonce !== "number"
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid payload" });
    }

    if (Date.now() - challenge.issuedAt > POW_CHALLENGE_TTL_MS) {
      return res
        .status(400)
        .json({ success: false, error: "Challenge expired" });
    }

    const payload = `${createPowPayload(challenge)}:${nonce}`;
    const hashBytes = new Uint8Array(createHash("sha256").update(payload).digest());
    const isValid = hashMeetsDifficulty(hashBytes, POW_DIFFICULTY);

    return res.status(200).json({ success: isValid });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, error: "Method Not Allowed" });
}
