export type TelegramVerifyResponse = {
  ok: boolean;
  slug?: string;
  telegramUsername?: string;
  error?: string;
};

type TelegramConfirmation = {
  slug: string;
  token: string;
  telegramUsername?: string;
  confirmedAt: number;
};

const STORAGE_PREFIX = "p2p_telegram_confirm:";

export const normalizeTelegramSlug = (slug?: string | null) =>
  (slug || "").trim().replace(/^@/, "");

const getStorageKey = (slug: string) => `${STORAGE_PREFIX}${slug}`;

const toBase64Url = (input: string) => {
  if (typeof btoa !== "function") {
    throw new Error("btoa is not available");
  }
  const base64 = btoa(input);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const hmacSha256 = async (message: string, secret: string) => {
  if (!globalThis.crypto?.subtle) {
    throw new Error("WebCrypto is not available");
  }
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await globalThis.crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message),
  );
  const bytes = new Uint8Array(sig).slice(0, 12);
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return toBase64Url(bin);
};

export const buildTelegramStartPayload = async (slug: string, secret: string) => {
  const normalized = normalizeTelegramSlug(slug);
  const ts = Math.floor(Date.now() / 1000).toString().padStart(10, "0");
  const message = `${normalized}.${ts}`;
  const signature = await hmacSha256(message, secret);
  return `${normalized}${ts}${signature}`;
};

export const buildTelegramStartLink = async ({
  slug,
  botUsername,
  botStartSecret,
}: {
  slug: string;
  botUsername: string;
  botStartSecret: string;
}) => {
  const payload = await buildTelegramStartPayload(slug, botStartSecret);
  const normalizedBot = botUsername.replace(/^@/, "");
  return `https://t.me/${normalizedBot}?start=${payload}`;
};

export const storeTelegramConfirmation = (data: TelegramConfirmation) => {
  if (typeof window === "undefined") return;
  const key = getStorageKey(normalizeTelegramSlug(data.slug));
  localStorage.setItem(key, JSON.stringify(data));
};

export const readTelegramConfirmation = (slug: string) => {
  if (typeof window === "undefined") return null;
  const key = getStorageKey(normalizeTelegramSlug(slug));
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TelegramConfirmation;
  } catch (error) {
    localStorage.removeItem(key);
    return null;
  }
};

export const clearTelegramConfirmation = (slug: string) => {
  if (typeof window === "undefined") return;
  const key = getStorageKey(normalizeTelegramSlug(slug));
  localStorage.removeItem(key);
};

export const verifyTelegramToken = async (
  token: string,
): Promise<TelegramVerifyResponse> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_TELEGRAM_VERIFY_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3005/verify"
      : "/auth/telegram/verify");
  const url = `${baseUrl}?token=${encodeURIComponent(token)}`;
  const response = await fetch(url);
  if (!response.ok) {
    return {
      ok: false,
      error: `verify_failed_${response.status}`,
    };
  }
  return (await response.json()) as TelegramVerifyResponse;
};
