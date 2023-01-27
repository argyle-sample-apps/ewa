import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { colors } from "consts";
import { Account } from "models/account";

function withColors(accounts: Account[]) {
  return accounts?.map((account, index) => ({
    ...account,
    color: colors[index],
  }));
}

const fetchAccountsByUserId = async () => {
  const { data } = await axios.get<Account[]>(`/api/accounts`);

  const connected = data?.filter(
    (account) => account.was_connected && account.status !== "error"
  );

  const isPdConfigured = connected?.every(
    (account) => account.pay_distribution.status === "success"
  );

  return { connected: withColors(connected), isPdConfigured };
};

export function useAccounts() {
  return useQuery(["accounts"], () => fetchAccountsByUserId());
}
