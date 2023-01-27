import qs from "qs";
import { useRouter } from "next/router";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getCookie } from "cookies-next";
import { ReactElement } from "react";
import { useAtom } from "jotai";
import Fullscreen from "layouts/fullscreen";
import { Button } from "components/button";
import { Heading, Paragraph } from "components/typography";
import { formatCurrency } from "utils";
import { BRAND_NAME } from "consts";
import { useEarlyPay } from "hooks/useEarlyPay";
import { LoadingError } from "components/loader";
import { Transaction, transactionsAtom } from "stores/global";

const createTransaction = ({
  id,
  account,
  logo,
  amount,
}: Omit<Transaction, "type" | "datetime">): Transaction => {
  return {
    id: id,
    type: "one-time",
    datetime: new Date().toISOString(),
    account: account,
    amount: amount,
    logo: logo,
  };
};
export default function OneTimePaymentPage() {
  const router = useRouter();
  const {
    data: decision,
    isLoading: isEarlyPayLoading,
    isError: isEarlyPayError,
  } = useEarlyPay();

  const [transactions, setTransactions] = useAtom(transactionsAtom);

  const accounts = decision?.oneTime.map(
    (account) => account.linkItem.name
  ) as string[];

  const loanSum = decision?.oneTime.reduce((acc, dec) => acc + dec.amount, 0);
  const salarySum = decision?.oneTime.reduce((acc, dec) => acc + dec.salary, 0);

  // @ts-expect-error
  const lf = new Intl.ListFormat("en");
  const accountsFormatted = lf.format(accounts);

  const amount = formatCurrency(loanSum);
  const text = `${BRAND_NAME} will deposit ${amount} to your account.`;
  const redirect = "/early";
  const href = "/validation/success?" + qs.stringify({ text, redirect });

  const addTransactions = () => {
    const nextTransactions = decision?.oneTime
      .map((account: any) => {
        return createTransaction({
          id: account.linkItem.id,
          account: account.linkItem.name,
          logo: account.linkItem.logo_url,
          amount: account.amount,
        });
      })
      .filter(Boolean) as Transaction[];

    if (nextTransactions.length) {
      setTransactions([...transactions, ...nextTransactions]);
    }
  };

  if (isEarlyPayLoading) {
    return null;
  }
  if (isEarlyPayError) {
    return <LoadingError />;
  }

  return (
    <div className="flex h-full flex-col p-5">
      <div className="mt-auto">
        <Heading className="mb-4 mt-4">One-time payment</Heading>
        <Paragraph large className="mb-4 text-gray-T50">
          We’re ready to pay 70% of your {formatCurrency(salarySum)}{" "}
          {accountsFormatted} wage.
        </Paragraph>
        <Heading className="mb-4 mt-4">{formatCurrency(loanSum)}</Heading>
      </div>
      <Button
        onClick={() => {
          addTransactions();
          router.push(href);
        }}
      >
        Done
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

OneTimePaymentPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Fullscreen bg="yellow" back>
      {page}
    </Fullscreen>
  );
};
