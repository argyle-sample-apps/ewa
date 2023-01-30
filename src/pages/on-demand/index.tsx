import { ReactElement, useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { useAtom, useAtomValue } from "jotai";
import { useRouter } from "next/router";
import qs from "qs";
import { subDays } from "date-fns";
import Fullscreen from "layouts/fullscreen";
import { Button } from "components/button";
import { Heading, Paragraph } from "components/typography";
import { Slider } from "components/slider";
import { formatCurrency } from "utils/index";
import { LeftArrowIcon } from "components/icons";
import {
  Transaction,
  transactionsAtom,
  uniqueAccountsAtom,
} from "stores/global";
import { useAccounts } from "hooks/useAccounts";
import { LoadingError } from "components/loader";
import { Account } from "models/account";
import { useEarlyPay } from "hooks/useEarlyPay";
import { BRAND_NAME } from "consts";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getCookie } from "cookies-next";

const createTransaction = ({
  id,
  account,
  logo,
  amount,
}: Omit<Transaction, "type" | "datetime">): Transaction => {
  return {
    id: id,
    type: "on-demand",
    datetime: new Date().toISOString(),
    account: account,
    amount: amount,
    logo: logo,
  };
};

const withCurrentValue = (accounts: any[]) =>
  accounts.map((account) => ({ ...account, value: 0 }));

export default function OnDemandPage() {
  const router = useRouter();
  const {
    data: decision,
    isLoading: isEarlyPayLoading,
    isError: isEarlyPayError,
  } = useEarlyPay();

  const [transactions, setTransactions] = useAtom(transactionsAtom);
  const uniqueAccounts = useAtomValue(uniqueAccountsAtom);
  const [currentAccounts, setCurrentAccounts] = useState<any[]>();

  useEffect(() => {
    if (decision) {
      const filteredAccounts = decision.onDemand.filter(
        (dec) => !uniqueAccounts.includes(dec.linkItem.id)
      );
      const accounts = withCurrentValue(filteredAccounts);
      setCurrentAccounts(accounts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decision]);

  if (isEarlyPayLoading) {
    return null;
  }
  if (isEarlyPayError) {
    return <LoadingError />;
  }

  const addTransactions = () => {
    if (!currentAccounts) return;

    const nextTransactions = currentAccounts
      .map((account: any) => {
        if (account.value > 0) {
          return createTransaction({
            id: account.linkItem.id,
            account: account.linkItem.name,
            logo: account.linkItem.logo_url,
            amount: account.value,
          });
        }
      })
      .filter(Boolean) as Transaction[];

    if (nextTransactions.length) {
      setTransactions([...transactions, ...nextTransactions]);
    }
  };

  const sum = currentAccounts?.reduce((acc, val) => {
    return val.value + acc;
  }, 0);
  const inactive = sum === 0;
  const amount = formatCurrency(sum);
  const text = `${BRAND_NAME} will deposit ${amount} to your account.`;
  const redirect = "/early";
  const href = "/validation/success?" + qs.stringify({ text, redirect });

  return (
    <div
      className={clsx(
        "flex h-full flex-col bg-yellow-20 p-5 transition-colors",
        inactive ? "bg-gray-10" : "bg-yellow-20"
      )}
    >
      <Link href={"/early"}>
        <a className="block h-8 w-8 p-1">
          <LeftArrowIcon />
        </a>
      </Link>
      <div className="mt-auto">
        <Heading className="mb-4 mt-4">On-demand payment</Heading>
        {currentAccounts?.map((currentAccount) => (
          <div className="mb-4" key={currentAccount.linkItem.name}>
            <Paragraph large className="mb-4 text-gray-T50">
              Cash available: {formatCurrency(currentAccount.max)}
            </Paragraph>
            <Slider
              value={currentAccount.value}
              setCurrentValue={(value) => {
                setCurrentAccounts(
                  currentAccounts.map((account) => {
                    if (
                      account.linkItem.name === currentAccount.linkItem.name
                    ) {
                      return { ...account, value: value };
                    }
                    return account;
                  })
                );
              }}
              max={currentAccount.max}
              src={currentAccount.linkItem.logo_url}
            />
          </div>
        ))}
        <Paragraph className="mb-1 text-gray-T50">Amount</Paragraph>
        <Heading className="mb-10">{formatCurrency(sum)}</Heading>
      </div>
      <Button
        onClick={() => {
          addTransactions();
          router.push(href);
        }}
        disabled={inactive}
      >
        Get money now
      </Button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const userId = getCookie("argyle-x-user-id", ctx);

  if (!userId) {
    return {
      redirect: { destination: "/admin", permanent: false },
    };
  }

  return {
    props: {},
  };
};

OnDemandPage.getLayout = function getLayout(page: ReactElement) {
  return <Fullscreen bg={"gray"}>{page}</Fullscreen>;
};
