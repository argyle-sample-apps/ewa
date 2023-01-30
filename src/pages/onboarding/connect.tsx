import { ReactElement } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import Fullscreen from "layouts/fullscreen";
import { Button } from "components/button";
import { Heading, Paragraph } from "components/typography";
import { PlusIcon } from "components/icons";
import { ArgyleLink } from "components/argyle-link";
import { Checklist, variants } from "components/checkbox";
import { CHECKLIST_ITEMS } from "consts";
import { useConfig } from "hooks/useConfig";
import { formatCurrency } from "utils";
import { useLink } from "hooks/useLink";

export default function ConnectPage() {
  const router = useRouter();
  const config = useConfig();

  const {
    openLink,
    isLinkLoading,
    isLinkOpen,
    setLinkInstance,
    setIsLinkOpen,
  } = useLink();

  const onClose = () => {
    setIsLinkOpen(false);
    router.replace("/early/decision");
  };

  const checklistItems = [
    {
      id: CHECKLIST_ITEMS[0].id,
      text: CHECKLIST_ITEMS[0].text,
      variant: variants.CHECKED,
    },
    {
      id: CHECKLIST_ITEMS[1].id,
      text: CHECKLIST_ITEMS[1].text,
    },
    {
      id: CHECKLIST_ITEMS[2].id,
      text: `Job tenure at least ${config.duration} ${config.duration_cycle}s`,
    },
    {
      id: CHECKLIST_ITEMS[3].id,
      text: `Earn at least ${formatCurrency(config.pay)}/${config.pay_cycle}`,
    },
    {
      id: CHECKLIST_ITEMS[4].id,
      text: CHECKLIST_ITEMS[4].text,
    },
  ];

  return (
    <>
      <ArgyleLink
        customConfig={{
          onClose: onClose,
        }}
        onLinkInit={(link) => {
          setLinkInstance(link);
        }}
      />
      {!isLinkOpen && (
        <div className="flex h-full flex-col p-5">
          <div className="mt-auto">
            <PlusIcon />
            <Heading className="mb-4 mt-4">
              Connect all the places you work at to maximize your payouts
            </Heading>
            <Paragraph large className="mb-4 text-gray-T50">
              Fulfill the conditions listed below.
            </Paragraph>
          </div>
          <Checklist items={checklistItems} className="mb-12" />
          <div className={clsx(isLinkLoading && "animate-pulse")}>
            <Button onClick={openLink}>Connect your work</Button>
          </div>
        </div>
      )}
    </>
  );
}

ConnectPage.getLayout = function getLayout(page: ReactElement) {
  return <Fullscreen back>{page}</Fullscreen>;
};
