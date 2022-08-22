import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { z } from "zod";
import { endOfMonth, formatISO, startOfMonth, subMonths } from "date-fns";
import { getAuthOpts } from "../utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const today = new Date();
  const startMonth = subMonths(today, 7);
  const endMonth = subMonths(today, 1);
  const fromStartDate = formatISO(startOfMonth(startMonth), {
    representation: "date",
  });
  const toStartDate = formatISO(endOfMonth(endMonth), {
    representation: "date",
  });

  try {
    const { userId } = z
      .object({
        userId: z.string(),
      })
      .parse(req.query);

    const { headers } = getAuthOpts();

    const params = {
      user: userId,
      from_start_date: fromStartDate,
      to_start_date: toStartDate,
    };

    const { data } = await axios.get("/payouts", {
      baseURL: process.env.NEXT_PUBLIC_ARGYLE_BASE_URL,
      headers,
      params,
    });

    res.status(200).json(data.results);
  } catch (error) {
    res.status(400).json(error);
  }
}
