import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { Employment } from "models/employment";

const fetchEmploymentsByUserId = async (userId: string) => {
  const { data } = await axios.get<Employment[]>(`/api/employments/${userId}`);

  return data;
};

export function useEmployments() {
  const userId = getCookie("argyle-x-user-id") as string;

  return useQuery(["employments", userId], () =>
    fetchEmploymentsByUserId(userId)
  );
}
