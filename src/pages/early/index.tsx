import React from "react";
import { useAtomValue } from "jotai";
import { ReactElement } from "react";
import Fullscreen from "layouts/fullscreen";
import { Title, Subheading, Footnote } from "components/typography";
import { BackInTimeIcon, BoltIcon } from "components/icons";
import { LoadingError } from "components/loader";
import { ListItemWithIconAndData } from "components/list";
import { Splitter } from "components/splitter";
import { formatCurrency } from "utils";
import { AddMoreAccountsButton } from "components/add-more-accounts-button";
import { useEarlyPay } from "hooks/useEarlyPay";
import {
  featuresAtom,
  transactionsAtom,
  uniqueAccountsAtom,
} from "stores/global";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getCookie } from "cookies-next";

export default function EarlyPayRootPage() {
  const transactions = useAtomValue(transactionsAtom);
  const features = useAtomValue(featuresAtom);
  const uniqueAccounts = useAtomValue(uniqueAccountsAtom);
  const {
    data: decision,
    isLoading: isEarlyPayLoading,
    isError: isEarlyPayError,
  } = useEarlyPay();

  if (isEarlyPayLoading) {
    return null;
  }
  if (isEarlyPayError) {
    return <LoadingError />;
  }

  const onDemandSum = decision.onDemand
    .filter((dec) => !uniqueAccounts.includes(dec.linkItem.id))
    .reduce((acc, dec) => acc + dec.max, 0);
  const oneTimeSum = decision.oneTime
    .filter((dec) => !uniqueAccounts.includes(dec.linkItem.id))
    .reduce((acc, dec) => acc + dec.amount, 0);
  const availableAmount = onDemandSum + oneTimeSum;

  const onDemandAccounts = decision.onDemand.map(
    (account) => account.linkItem.logo_url
  );
  const oneTimeAccounts = decision.oneTime.map(
    (account) => account.linkItem.logo_url
  );

  const items = [
    {
      icon: <BoltIcon />,
      label: "On-demand payment",
      description: "Access money as soon as you earn it",
      href: "/on-demand/",
      amount: formatCurrency(onDemandSum),
      accounts: onDemandAccounts,
      disabled: onDemandSum === 0 || !features["on-demand"],
    },
    {
      icon: <BackInTimeIcon />,
      label: "One-time payments",
      description: "70% of your wage available once per month",
      href: "/one-time/",
      amount: formatCurrency(oneTimeSum),
      accounts: oneTimeAccounts,
      disabled: oneTimeSum === 0 || !features["one-time"],
    },
  ];

  return (
    <div className="px-4 pt-2 pb-12">
      <div className="flex items-center justify-between">
        <Subheading>Early Pay</Subheading>
      </div>
      <div className="flex justify-center py-10">
        <div className="text-center">
          <Footnote className="text-gray-T50">Available amount</Footnote>
          <Title>{formatCurrency(availableAmount)}</Title>
        </div>
      </div>
      <div className="mb-4">
        <Splitter />
        {items.map(
          (
            { icon, label, description, amount, accounts, href, disabled },
            i
          ) => (
            <React.Fragment key={label + i}>
              <ListItemWithIconAndData
                icon={icon}
                label={label}
                description={description}
                amount={amount}
                accounts={accounts}
                href={href}
                disabled={disabled}
              />
              <Splitter />
            </React.Fragment>
          )
        )}
      </div>
      <AddMoreAccountsButton
        type="circle"
        title="Set up early pay for another employer"
      />
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

EarlyPayRootPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Fullscreen navigation bg="blue" logo>
      {page}
    </Fullscreen>
  );
};
