import type { NextApiRequest, NextApiResponse } from "next";
import {
  setTelegramConfirmation,
  TelegramConfirmRecord,
} from "../../../cache/telegramConfirm";

type ConfirmPayload = {
  ok?: boolean;
  status?: string;
  slug?: string;
  telegramUserId?: string | number | null;
  telegramUsername?: string | null;
  confirmToken?: string;
  expiresAt?: string | null;
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  let body = (req.body || {}) as ConfirmPayload | string;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body) as ConfirmPayload;
    } catch {
      return res.status(400).json({ ok: false, error: "invalid_json" });
    }
  }

  if (!body.ok || body.status !== "confirmed") {
    return res.status(400).json({ ok: false, error: "invalid_status" });
  }

  if (!isNonEmptyString(body.slug) || !isNonEmptyString(body.confirmToken)) {
    return res.status(400).json({ ok: false, error: "invalid_payload" });
  }

  const record: TelegramConfirmRecord = {
    ok: true,
    status: "confirmed",
    slug: body.slug.trim(),
    telegramUserId: body.telegramUserId ?? null,
    telegramUsername: body.telegramUsername ?? null,
    confirmToken: body.confirmToken,
    expiresAt: body.expiresAt ?? null,
    receivedAt: new Date().toISOString(),
  };

  await setTelegramConfirmation(record);

  return res.status(200).json({ ok: true });
}
