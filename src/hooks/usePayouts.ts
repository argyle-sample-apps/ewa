import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Payout } from "models/payout";

const fetchPayoutsByUserId = async () => {
  const { data } = await axios.get<Payout[]>(`/api/payouts`);

  return data;
};

export function usePayouts() {
  return useQuery(["payouts"], () => fetchPayoutsByUserId());
}
