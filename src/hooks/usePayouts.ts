import axios from "axios";
import { useGlobalStore } from "stores/global";
import { useQuery } from "@tanstack/react-query";
import { Payout } from "models/payout";

const fetchPayoutsByUserId = async (userId: string) => {
  const { data } = await axios.get<Payout[]>(`/api/payouts/${userId}`);

  return data;
};

export function usePayouts() {
  const userId = useGlobalStore((state) => state.userId);

  return useQuery(["payouts", userId], () => fetchPayoutsByUserId(userId));
}
