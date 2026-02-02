import type { NextApiRequest, NextApiResponse } from "next";
import {
  clearTelegramConfirmation,
  getTelegramConfirmation,
} from "../../../cache/telegramConfirm";

const isExpired = (expiresAt?: string | null) => {
  if (!expiresAt) return false;
  const expMs = Date.parse(expiresAt);
  if (Number.isNaN(expMs)) return false;
  return expMs <= Date.now();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  const slugParam = req.query?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
  if (!slug) return res.status(400).json({ ok: false, error: "missing_slug" });

  const record = await getTelegramConfirmation(slug);
  if (!record) return res.status(200).json({ ok: true, confirmed: false });

  if (isExpired(record.expiresAt)) {
    await clearTelegramConfirmation(slug);
    return res.status(200).json({ ok: true, confirmed: false });
  }

  return res.status(200).json({
    ok: true,
    confirmed: true,
    record,
  });
}
