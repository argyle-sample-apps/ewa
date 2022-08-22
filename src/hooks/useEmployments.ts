import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useGlobalStore } from "stores/global";
import { Employment } from "models/employment";

const fetchEmploymentsByUserId = async (userId: string) => {
  const { data } = await axios.get<Employment[]>(`/api/employments/${userId}`);

  return data;
};

export function useEmployments() {
  const userId = useGlobalStore((state) => state.userId);

  return useQuery(["employments", userId], () =>
    fetchEmploymentsByUserId(userId)
  );
}
