import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useAccounts } from "hooks/useAccounts";
import { useEarlyPay } from "hooks/useEarlyPay";
import { DecorativeIconWrapper } from "components/decorative-icon-wrapper";
import { EarlyPayIcon } from "components/icons";
import { Strong, Heading, Paragraph } from "components/typography";
import { Button, InlineButton } from "components/button";
import { useGlobalStore } from "stores/global";
import { ArgyleLink } from "components/argyle-link";
import { Criteria } from "components/criteria";
import { formatCurrency } from "utils";
import WithBackButton from "layouts/with-back-button";
import { Account } from "models/account";
import { useUnit } from "hooks/useUnit";

export default function EarlyPayConfirmPage() {
  const router = useRouter();

  const isActive = useGlobalStore((state) => state.earlypay.isActive);
  const setFeatureState = useGlobalStore((state) => state.setFeatureState);
  const setTransactions = useGlobalStore((state) => state.setTransactions);
  const setActiveAccounts = useGlobalStore((state) => state.setActiveAccounts);
  const activeAccounts = useGlobalStore(
    (state) => state.earlypay.activeAccounts
  );

  const [linkLoading, setLinkLoading] = useState(false);
  const [linkInstance, setLinkInstance] = useState<any>();
  const [linkOpen, setLinkOpen] = useState(false);
  const [triggerPdFlow, setTriggerPdFlow] = useState(false);

  const {
    data: accounts,
    isLoading: isAccountsLoading,
    isError: isAccountsError,
  } = useAccounts();
  const {
    data: decision,
    isLoading: isEarlyPayLoading,
    isError: isEarlyPayError,
  } = useEarlyPay({
    activeAccounts,
  });
  const { data: unit } = useUnit({
    enabled: false,
  });

  function setupEarlyPayAndContinue(accounts: Account[], decision: any) {
    if (!isActive) {
      setFeatureState("earlypay", true);
    }

    const accountIds = accounts.map((account) => account.id);
    setActiveAccounts(accountIds);

    setTransactions(accounts, decision);

    router.push(
      `/early/success?amount=${decision.combined.initial}`,
      "/early/success"
    );
  }

  const setup = async () => {
    if (!accounts?.isPdConfigured) {
      setTriggerPdFlow(true);
    } else {
      setupEarlyPayAndContinue(accounts.connected, decision);
    }
  };

  const handleLinkOpen = () => {
    if (!linkInstance) {
      return setLinkLoading(true);
    }

    setup();
  };

  const nextAccount = accounts?.connected.find(
    (account) => account.pay_distribution.status !== "success"
  );

  const nextLinkItem = nextAccount ? nextAccount.link_item : null;

  useEffect(() => {
    if (linkInstance && linkLoading === true) {
      setLinkLoading(false);
      setup();
    }
  }, [linkLoading, linkInstance]);

  useEffect(() => {
    if (!linkOpen && triggerPdFlow) {
      if (nextLinkItem) {
        linkInstance.open();
        setLinkOpen(true);
      } else {
        setTriggerPdFlow(false);
      }
    }
  }, [triggerPdFlow, nextLinkItem, linkInstance, linkOpen]);

  if (isAccountsLoading || isEarlyPayLoading) {
    return (
      <div className="grid animate-pulse gap-3 px-4">
        <div className="h-7 w-20 rounded-full bg-gray-200"></div>
        <div className="h-4 w-full rounded-full bg-gray-200"></div>
        <div className="h-4 w-4/6 rounded-full bg-gray-200"></div>
        <div className="h-4 w-5/6 rounded-full bg-gray-200"></div>
        <div className="h-10 w-3/6 rounded-full bg-gray-200"></div>
      </div>
    );
  }

  if (isAccountsError || isEarlyPayError) {
    return <div>Error</div>;
  }

  return (
    <div className="px-4 pt-4">
      <ArgyleLink
        payDistributionUpdateFlow={true}
        linkItemId={nextLinkItem}
        onClose={() => {
          setLinkOpen(false);
        }}
        onLinkInit={(link) => setLinkInstance(link)}
      />
      <DecorativeIconWrapper>
        <EarlyPayIcon />
      </DecorativeIconWrapper>
      <Heading className="mb-3">Almost there</Heading>
      <Paragraph className="mb-4">
        We&apos;re ready to deposit{" "}
        <Strong>{formatCurrency(decision?.combined?.initial)}</Strong> to your
        account as soon as you complete your application.
      </Paragraph>
      <Criteria />
      <div className="mt-4 flex">
        <div className={clsx("flex", linkLoading && "animate-pulse")}>
          <Button onClick={handleLinkOpen} disabled={!unit}>
            Complete application
          </Button>
        </div>
        <InlineButton
          className="ml-4"
          onClick={() => router.back()}
          as="button"
        >
          Cancel
        </InlineButton>
      </div>
    </div>
  );
}

EarlyPayConfirmPage.getLayout = function getLayout(page: ReactElement) {
  return <WithBackButton>{page}</WithBackButton>;
};
