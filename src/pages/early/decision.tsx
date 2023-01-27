import qs from "qs";
import { ReactElement, useCallback, useEffect, useState } from "react";
import remove from "just-remove";
import clsx from "clsx";
import { useRouter } from "next/router";
import { Heading, Paragraph } from "components/typography";
import { Button, buttonColors } from "components/button";
import { ErrorCircleIcon } from "components/icons";
import { StarsIcon } from "components/icons";
import { Criteria } from "components/criteria";
import Fullscreen from "layouts/fullscreen";
import { BRAND_NAME, PD_CONFIG } from "consts";
import { useAccounts } from "hooks/useAccounts";
import { useEarlyPay } from "hooks/useEarlyPay";
import { Loader } from "components/loader";
import { formatCurrency } from "utils";
import { ArgyleLink, LinkInstance } from "components/argyle-link";

export default function EarlyPayConfirmPage() {
  const router = useRouter();

  const [fallbackInstance, setFallbackInstance] = useState<any>();
  const [instances, setInstances] = useState<LinkInstance[]>([]);
  const [switched, setSwitched] = useState<string[]>([]);
  const [linkLoading, setLinkLoading] = useState(false);
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
  } = useEarlyPay();

  const setup = useCallback(() => {
    const allItems =
      accounts?.connected.map((account) => account.link_item) || [];
    const leftItems = remove(allItems, switched);
    const nextItem = leftItems.length > 0 ? leftItems[0] : null;

    setTriggerPdFlow(true);

    if (instances.length !== switched.length && instances.length > 0) {
      const instance = instances.find((i) => i.id === nextItem);

      instance?.link.open();
    } else {
      setTriggerPdFlow(false);

      const redirect = "/early";
      const text =
        "Your application has been completed. You are ready to use Early Pay.";
      const href = "/validation/success?" + qs.stringify({ text, redirect });
      router.push(href);
    }
  }, [router, accounts, switched, instances]);

  const handleLinkOpen = () => {
    if (instances.length === 0) {
      return setLinkLoading(true);
    }

    setup();
    setLinkOpen(true);
  };

  useEffect(() => {
    if (instances.length > 0 && linkLoading === true) {
      setLinkLoading(false);
      setup();
    }
  }, [linkLoading, instances, setLinkLoading, setup]);

  const onClose = () => {
    setLinkOpen(false);
  };

  useEffect(() => {
    if (!linkOpen && triggerPdFlow) {
      setup();
      setLinkOpen(true);
    }
  }, [linkOpen, triggerPdFlow, setup]);

  const onPayDistributionSuccess = ({ linkItemId }: { linkItemId: string }) => {
    setSwitched((prev) => [...prev, linkItemId]);
  };

  if (isAccountsLoading || isEarlyPayLoading) {
    return <Loader />;
  }

  if (isAccountsError || isEarlyPayError) {
    return <div>Error</div>;
  }
  const weekly = formatCurrency(decision?.monthly / 4);
  const tenure = Math.max(...decision.durations);

  if (!decision.approved) {
    return (
      <>
        <ArgyleLink
          onLinkInit={(instance) => {
            setFallbackInstance(instance);
          }}
          customConfig={{
            onClose: onClose,
          }}
        />
        <div className="flex h-full flex-col p-5">
          <div className="mt-auto">
            <ErrorCircleIcon />
            <Heading className="mb-4 mt-4">Sorry</Heading>
            <Paragraph large className="mb-4 text-gray-T50">
              I looks like your work tenure is {tenure} months and your income
              is {weekly} per week. Try connecting more work accounts or come
              back later.
            </Paragraph>
          </div>
          <div className="h-[182px]">
            <Criteria />
          </div>
          <div className={clsx("flex", linkLoading && "animate-pulse")}>
            <Button
              onClick={() => {
                fallbackInstance.open();
              }}
            >
              Connect more work
            </Button>
          </div>
          <Button color={buttonColors.GRAY} href={"/onboarding/connect"}>
            Cancel
          </Button>
        </div>
      </>
    );
  }
  return (
    <>
      {accounts.connected.map((account) => {
        const item = account.link_item;

        return (
          <ArgyleLink
            key={account.id}
            onLinkInit={(instance) => {
              setInstances((prev) => [...prev, { id: item, link: instance }]);
            }}
            customConfig={{
              linkItems: [item],
              payDistributionAutoTrigger: true,
              payDistributionUpdateFlow: true,
              payDistributionConfig: PD_CONFIG,
              onClose: onClose,
              onPayDistributionSuccess: onPayDistributionSuccess,
            }}
          />
        );
      })}

      <div className="flex h-full flex-col p-5">
        <div className="mt-auto">
          <StarsIcon />
          <Heading className="mb-4 mt-4">Almost there</Heading>
          <Paragraph large className="mb-4 text-gray-T50">
            Direct your income to {BRAND_NAME} and use your hard-earned cash
            right away.
          </Paragraph>
        </div>
        <Criteria />
        <div className={clsx("flex", linkLoading && "animate-pulse")}>
          <Button onClick={handleLinkOpen}>Direct your income</Button>
        </div>
      </div>
    </>
  );
}

EarlyPayConfirmPage.getLayout = function getLayout(page: ReactElement) {
  return <Fullscreen back>{page}</Fullscreen>;
};
