import qs from "qs";
import axios from "axios";
import { useGlobalStore } from "stores/global";
import { useQuery } from "@tanstack/react-query";

type Decision = {
  approved: boolean;
  durations: number[];
  monthly: number;
  combined: {
    initial: number;
    daily: number;
  };
  criteria: {
    duration: boolean;
    pay: boolean;
  };
  payouts: Record<string, { initial: number; daily: number }>;
};

type useEarlyPayProps = {
  activeAccounts: string[];
};

const fetchEarlyPayDecision = async (userId: string, params: string) => {
  const { data } = await axios.get<Decision>(`/api/early/${userId}?${params}`);

  return data;
};

export function useEarlyPay({ activeAccounts }: useEarlyPayProps) {
  const params = qs.stringify({ a: activeAccounts });
  const userId = useGlobalStore((state) => state.userId);

  return useQuery(
    ["early-pay", userId],
    () => fetchEarlyPayDecision(userId, params),
    { useErrorBoundary: true, refetchOnWindowFocus: false, retry: true }
  );
}
