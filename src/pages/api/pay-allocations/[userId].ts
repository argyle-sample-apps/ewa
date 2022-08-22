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

    const params = {
      user: userId,
    };

    const { data } = await axios.get("/pay-allocations", {
      baseURL: process.env.NEXT_PUBLIC_ARGYLE_BASE_URL,
      headers,
      params,
    });

    res.status(200).json(data.results);
  } catch (error) {
    res.status(400).json(error);
  }
}
