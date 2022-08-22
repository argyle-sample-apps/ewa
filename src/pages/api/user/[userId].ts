import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { z } from "zod";
import { getAuthOpts } from "../utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId } = z
      .object({
        userId: z.string(),
      })
      .parse(req.query);

    const { headers } = getAuthOpts();

    const { data } = await axios.get("/users/" + userId, {
      baseURL: process.env.NEXT_PUBLIC_ARGYLE_BASE_URL,
      headers,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
}
