import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getCookie } from "cookies-next";
import { getAuthOpts } from "../utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = getCookie("argyle-x-user-id", { req, res });
  try {
    const { headers } = getAuthOpts();

    const params = {
      user: userId,
    };

    const year = 2022;

    const { data } = await axios.get("/income/payouts/" + year, {
      baseURL: "https://bff.argyle.com",
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
