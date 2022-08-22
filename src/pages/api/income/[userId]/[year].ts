import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthOpts } from "../../utils";
import axios from "axios";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId, year } = z
      .object({
        userId: z.string(),
        year: z.string(),
      })
      .parse(req.query);

    const { headers } = getAuthOpts();

    const params = {
      user: userId,
    };

    const { data } = await axios.get("/income/payouts/" + year, {
      baseURL: process.env.BFF_API_URL,
      headers: {
        ...headers,
        "x-argyle-is-sandbox": "true",
      },
      params,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
}
