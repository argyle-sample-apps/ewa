import { useState, useEffect, ReactElement } from "react";
import clsx from "clsx";
import Link from "next/link";
import WithBottomNavigation from "layouts/with-bottom-navigation";
import { useRouter } from "next/router";
import { useGlobalStore } from "stores/global";
import { useProfile } from "hooks/useProfile";
import { useAccounts } from "hooks/useAccounts";
import { useEarlyPay } from "hooks/useEarlyPay";
import {
  Heading,
  Paragraph,
  Subheading,
  Subparagraph
} from "components/typography";
import { Button, InlineButton } from "components/button";
import { Avatar } from "components/avatar";
import { Loader } from "components/loader";
import { ArgyleLink } from "components/argyle-link";
import { Criteria } from "components/criteria";
import { AddBigIcon, LeftArrowIcon, LogotypeIcon } from "components/icons";
import { formatCurrency } from "utils";
import { Account } from "models/account";
import { useQueryClient } from "@tanstack/react-query";

export default function EarlyPayOnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [linkLoading, setLinkLoading] = useState(false);
  const [linkInstance, setLinkInstance] = useState<any>();

  const activeAccounts = useGlobalStore(
    (state) => state.earlypay.activeAccounts
  );

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError
  } = useProfile();
  const {
    data: accounts,
    isLoading: isAccountsLoading,
    isError: isAccountsError
  } = useAccounts();
  const {
    data: decision,
    isLoading: isEarlyPayLoading,
    isError: isEarlyPayError
  } = useEarlyPay({
    activeAccounts
  });

  const handleLinkOpen = () => {
    if (!linkInstance) {
      return setLinkLoading(true);
    }

    linkInstance.open();
  };

  useEffect(() => {
    if (linkInstance && linkLoading === true) {
      setLinkLoading(false);
      linkInstance.open();
    }
  }, [linkLoading, linkInstance]);

  const handleLinkClose = () => {
    queryClient.invalidateQueries(["accounts"]);
    queryClient.invalidateQueries(["early-pay"]);
  };

  function getSortedAccounts(): any[] {
    // display connected accounts first
    const isActive = (account: Account) =>
      Number(activeAccounts.includes(account.id));
    const sorted = [...(accounts?.connected ? accounts.connected : [])].sort(
      (a, b) => isActive(b) - isActive(a)
    );

    return sorted;
  }

  if (isProfileLoading || isAccountsLoading || isEarlyPayLoading) {
    return <Loader />;
  }

  if (isProfileError || isAccountsError || isEarlyPayError) {
    return <div>An error occured.</div>;
  }

  const sortedAccounts = getSortedAccounts();

  const initial = formatCurrency(decision?.combined?.initial);
  const daily = formatCurrency(decision?.combined?.daily);
  const allActive = activeAccounts.length === accounts?.connected.length;

  return (
    <>
      <ArgyleLink
        payDistributionUpdateFlow={false}
        linkItemId={null}
        onClose={() => handleLinkClose()}
        onLinkInit={(link) => {
          setLinkInstance(link);
        }}
      />
      <div className="px-4 pt-6 pb-12">
        <div className="mb-10 flex items-center justify-between">
          {activeAccounts.length > 0 ? (
            <Link href="root">
              <a>
                <button
                  className="block h-8 w-8 p-1 text-now-grey"
                  onClick={() => router.back()}
                >
                  <LeftArrowIcon />
                </button>
              </a>
            </Link>
          ) : (
            <div className="w-[175px]">
              <LogotypeIcon />
            </div>
          )}
          <Link href="/settings">
            <a>
              <Avatar src={profile?.picture_url} />
            </a>
          </Link>
        </div>
        <Heading className="mb-3 w-3/4">
          {allActive && initial && daily
            ? `Add more employers to increase early pay`
            : decision.approved
            ? `Get up to ${initial} now and up to ${daily} every day`
            : `Get up to 70% of your income as soon as you earn it`}
        </Heading>
        <Paragraph className="mb-6">
          Don’t wait weeks or months for your paycheck. Direct your income to
          GoodLoans and use your hard-earned cash right away.
        </Paragraph>
        <Criteria view="compact" />
        <Subheading className="mt-6 mb-4 w-3/4">
          <span>Connected employers:</span>
        </Subheading>
        {sortedAccounts.map((account) => {
          const linkItem = account.link_item_details;
          const isActive = activeAccounts.includes(account.id);

          return (
            <button
              disabled={isActive}
              key={account.id}
              className={clsx(
                "mt-1 flex w-full items-center p-1",
                isActive && "cursor-not-allowed"
              )}
            >
              <img
                className={clsx("mr-4 h-8 w-8 rounded-full")}
                src={linkItem.logo_url}
                alt={linkItem.name}
              />
              <div className={clsx("text-left", !isActive && "py-2.5")}>
                <Subheading>{linkItem.name}</Subheading>
                {isActive && (
                  <Subparagraph className="!text-now-green">
                    Connected
                  </Subparagraph>
                )}
              </div>
            </button>
          );
        })}
        <div className={clsx("mt-3", linkLoading && "animate-pulse")}>
          <InlineButton
            onClick={handleLinkOpen}
            className="flex items-center !text-now-purple"
          >
            <span className="mr-3 p-1">
              <AddBigIcon />
            </span>
            Add another employer
          </InlineButton>
        </div>
        <div className={clsx("mt-12 flex")}>
          <Button
            as="button"
            onClick={() => {
              if (!decision.approved) {
                router.push("/early/rejected");
              } else {
                router.push("/early/confirm");
              }
            }}
            disabled={allActive}
          >
            Set up early pay
          </Button>
        </div>
      </div>
    </>
  );
}

EarlyPayOnboardingPage.getLayout = function getLayout(page: ReactElement) {
  return <WithBottomNavigation>{page}</WithBottomNavigation>;
};
