import axios from "axios";
import { useGlobalStore } from "stores/global";
import { useQuery } from "@tanstack/react-query";

export const fetchUnitByUserId = async (userId: string) => {
  const { data } = await axios.get(`/api/unit/${userId}`);

  return data;
};

export function useUnit({ enabled }: { enabled: boolean }) {
  const userId = useGlobalStore((state) => state.userId);

  return useQuery(["unit", userId], () => fetchUnitByUserId(userId), {
    enabled: !!userId && enabled,
  });
}
