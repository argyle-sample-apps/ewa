import type { ReactElement } from "react";
import { useAtomValue } from "jotai";
import React from "react";
import { useState } from "react";
import clsx from "clsx";
import { Tab } from "@headlessui/react";
import groupBy from "just-group-by";
import { format, lightFormat, parseISO } from "date-fns";
import Fullscreen from "layouts/fullscreen";
import { Splitter } from "components/splitter";
import { Heading, Paragraph, Footnote } from "components/typography";
import { PlatformIcon } from "components/platform-icon";
import { capitalizeFirstLetter, formatCurrency } from "utils";
import { Transaction, transactionsAtom } from "stores/global";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getCookie } from "cookies-next";

const TABS = [
  { id: 0, type: "all", label: "All" },
  { id: 1, type: "one-time", label: "One-time" },
  { id: 2, type: "on-demand", label: "On-demand" },
];

const formatHours = (datetime: string) =>
  lightFormat(parseISO(datetime), "HH:mm a");

const TransactionItem = ({
  type,
  account,
  amount,
  datetime,
  logo,
}: Transaction) => (
  <>
    <div className="grid grid-cols-listItemWithIconAndData py-5">
      <div className="flex h-full items-center">
        <PlatformIcon src={logo} />
      </div>
      <div className="ml-2">
        <Paragraph className="mb-1 text-black">{account}</Paragraph>
        <Footnote className="text-gray-T50">
          {capitalizeFirstLetter(type)}
        </Footnote>
      </div>
      <div className=" h-full text-right">
        <Paragraph className="mb-1 text-black">
          {formatCurrency(amount)}
        </Paragraph>
        <Footnote className="text-gray-T50">{formatHours(datetime)}</Footnote>
      </div>
    </div>
    <Splitter />
  </>
);

const filterTransactions = (transactions: Transaction[], type: string) => {
  if (type === "all") {
    return transactions;
  } else {
    return transactions.filter((transaction) => transaction.type === type);
  }
};

const sortTransactions = (transactions: Transaction[]) => {
  return transactions.sort((a, b) => {
    const dateA = new Date(a.datetime);
    const dateB = new Date(b.datetime);
    return dateB.getTime() - dateA.getTime();
  });
};

const groupTransactions = (transactions: Transaction[]) => {
  return groupBy(transactions, (transaction) =>
    lightFormat(parseISO(transaction.datetime), "yyyy-MMMM-dd")
  );
};

export default function HistoryPage() {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  const transactions = useAtomValue(transactionsAtom);

  const selectedFilter = TABS[activeTabIndex].type;
  const filteredTransactions = filterTransactions(transactions, selectedFilter);
  const sortedTransactions = sortTransactions(filteredTransactions);
  const groupedTransactions = groupTransactions(sortedTransactions);

  return (
    <div className="h-full px-4">
      <Heading className="pt-6 pb-3">Payment history</Heading>
      {transactions.length > 0 ? (
        <>
          <Tab.Group
            selectedIndex={activeTabIndex}
            onChange={setActiveTabIndex}
          >
            <Tab.List>
              {TABS.map((tab) => (
                <Tab
                  key={tab.type}
                  className={({ selected }) =>
                    clsx("pr-4", selected ? "text-black" : "text-gray-T40")
                  }
                >
                  {tab.label}
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>
          {Object.entries(groupedTransactions).map(([key, group]) => (
            <React.Fragment key={key}>
              <Paragraph small className="mt-10 mb-4 text-gray-T40">
                {format(new Date(key), "MMMM d")}
              </Paragraph>
              <Splitter />
              {group.map((item) => (
                <TransactionItem key={item.datetime + item.account} {...item} />
              ))}
            </React.Fragment>
          ))}
        </>
      ) : (
        <Paragraph className="mt-4 text-gray-T40">Nothing here yet</Paragraph>
      )}
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

HistoryPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Fullscreen navigation bg="blue">
      {page}
    </Fullscreen>
  );
};
