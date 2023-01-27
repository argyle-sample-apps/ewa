import type { ElementType, ReactElement } from "react";
import { formatISO, parseISO } from "date-fns";
import currency from "currency.js";
import Fullscreen from "layouts/fullscreen";
import { AddSmallIcon } from "components/icons";
import {
  Heading,
  Paragraph,
  Subheading,
  Subparagraph,
} from "components/typography";
import { useAccounts } from "hooks/useAccounts";
import { IncomeChart } from "views/income-chart";
import { useEmployments } from "hooks/useEmployments";
import { DataPoint } from "components/data-point";
import { usePayouts } from "hooks/usePayouts";
import { Account } from "models/account";
import { Loader, LoadingError } from "components/loader";
import { useIncome } from "hooks/useIncome";
import { Splitter } from "components/splitter";
import { IncomeSources } from "views/income-sources";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getCookie } from "cookies-next";

export default function Home() {
  const {
    data: accounts,
    isLoading: isAccountsLoading,
    isError: isAccountsError,
  } = useAccounts();
  const {
    data: employments,
    isLoading: isEmploymentsLoading,
    isError: isEmploymentsError,
  } = useEmployments();
  const {
    data: payouts,
    isLoading: isPayoutsLoading,
    isError: isPayoutsError,
  } = usePayouts();
  const {
    data: income,
    isLoading: isIcomeLoading,
    isError: isIncomeError,
  } = useIncome();

  if (
    isAccountsLoading ||
    isEmploymentsLoading ||
    isPayoutsLoading ||
    isIcomeLoading
  ) {
    return <Loader />;
  }

  if (
    isAccountsError ||
    isEmploymentsError ||
    isPayoutsError ||
    isIncomeError
  ) {
    return <LoadingError />;
  }

  return (
    <div className="px-4 pt-6 pb-12">
      <div className="mb-4 last:mb-0">
        <div className="flex items-center justify-between">
          <Heading>Income</Heading>
        </div>
      </div>
      <div className="my-4">
        <IncomeChart
          isMinimal
          income={income}
          accounts={accounts?.connected}
          selectedMode={0}
        />
        <div className="mt-4">
          <div className="mb-3 w-2/3">
            <Subheading className="text-black">Income sources</Subheading>
          </div>
          <Splitter />
          <IncomeSources
            accounts={accounts.connected}
            employments={employments}
            payouts={payouts}
          />
        </div>
      </div>
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

Home.getLayout = function getLayout(page: ReactElement) {
  return <Fullscreen navigation>{page}</Fullscreen>;
};
