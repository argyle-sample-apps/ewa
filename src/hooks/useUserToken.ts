import axios from "axios";
import { useMutation } from "@tanstack/react-query";

type UserTokenResponse = {
  access: string;
  refresh: string;
};

const fetchUserToken = async () => {
  const { data } = await axios.post<UserTokenResponse>(`/api/user-token`);

  return data;
};

export function useUserToken() {
  return useMutation(["user-token"], fetchUserToken);
}
