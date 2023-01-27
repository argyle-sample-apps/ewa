import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Decision } from "pages/api/early";

const fetchEarlyPayDecision = async () => {
  const { data } = await axios.get<Decision>(`/api/early`);

  return data;
};

export function useEarlyPay() {
  return useQuery(["early-pay"], () => fetchEarlyPayDecision(), {
    useErrorBoundary: true,
    refetchOnWindowFocus: false,
    retry: true,
  });
}
