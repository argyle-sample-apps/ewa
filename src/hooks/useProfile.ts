import axios from "axios";
import { useGlobalStore } from "stores/global";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "models/profile";

const fetchProfileById = async (id: string) => {
  const { data } = await axios.get<Profile>(`/api/profile/${id}`);

  return data;
};

export function useProfile() {
  const userId = useGlobalStore((state) => state.userId);

  return useQuery(["profile", userId], () => fetchProfileById(userId));
}
