import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Income } from "models/income";

const fetchIncome = async () => {
  const { data } = await axios.get<Income>(`/api/income`);

  return data;
};

export function useIncome() {
  return useQuery(["income"], () => fetchIncome());
}
