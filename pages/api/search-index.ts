import type { NextApiRequest, NextApiResponse } from "next";
import { redisGet } from "../../cache/redisClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  const cached = await redisGet("search:index");
  res.status(200).json(cached || { data: [], updatedAt: null });
}
