import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { Profile } from "models/profile";

const fetchProfileById = async (id: string) => {
  const { data } = await axios.get<Profile>(`/api/profile/${id}`);

  return data;
};

export function useProfile() {
  const userId = getCookie("argyle-x-user-id") as string;

  return useQuery(["profile", userId], () => fetchProfileById(userId));
}
