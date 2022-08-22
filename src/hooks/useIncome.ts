import axios from "axios";
import { getYear } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useGlobalStore } from "stores/global";
import { Income } from "models/income";

const fetchIncome = async (userId: string, year: number) => {
  const { data } = await axios.get<Income>(`/api/income/${userId}/${year}`);

  return data;
};

export function useIncome() {
  const userId = useGlobalStore((state) => state.userId);
  const year = getYear(new Date());

  return useQuery(["income", userId], () => fetchIncome(userId, year));
}
