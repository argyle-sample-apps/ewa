import axios from "axios";
import { colors } from "consts";
import { useGlobalStore } from "stores/global";
import { useQuery } from "@tanstack/react-query";
import { Account } from "models/account";

function withColors(accounts: Account[]) {
  return accounts?.map((account, index) => ({
    ...account,
    color: colors[index],
  }));
}

const fetchAccountsByUserId = async (userId: string) => {
  const { data } = await axios.get<Account[]>(`/api/accounts/${userId}`);

  const connected = data?.filter(
    (account) => account.was_connected && account.status !== "error"
  );

  const isPdConfigured = connected?.every(
    (account) => account.pay_distribution.status === "success"
  );

  return { connected: withColors(connected), isPdConfigured };
};

export function useAccounts() {
  const userId = useGlobalStore((state) => state.userId);

  return useQuery(["accounts", userId], () => fetchAccountsByUserId(userId));
}
