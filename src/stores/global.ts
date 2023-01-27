import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const linkScriptLoadedAtom = atom(false);

export type FeatureKeys = "on-demand" | "one-time" | "automatic-transfers";
type Features = {
  [key in FeatureKeys]: boolean;
};

export const featuresAtom = atomWithStorage<Features>("features", {
  ["on-demand"]: true,
  ["automatic-transfers"]: false,
  ["one-time"]: true,
});

export type Transaction = {
  id: string;
  type: "on-demand" | "one-time";
  datetime: string;
  account: string;
  logo: string;
  amount: number;
};

export const transactionsAtom = atomWithStorage<Transaction[]>(
  "transactions",
  []
);
export const uniqueAccountsAtom = atom((get) => {
  const transactions = get(transactionsAtom);
  const accounts = transactions.map((t) => t.id);
  const uniqueAccounts = Array.from(new Set(accounts));

  return uniqueAccounts;
});

function createTransaction(employer: string, logo: string, amountDue: number) {
  return {
    employer,
    logo,
    datetime: new Date().toISOString(),
    amount: amountDue,
  };
}
