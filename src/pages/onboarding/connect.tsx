import { ReactElement, useEffect, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import WithBackButton from "layouts/with-back-button";

import { Button } from "components/button";
import { Footnote, Heading, Paragraph } from "components/typography";
import { DecorativeIconWrapper } from "components/decorative-icon-wrapper";
import { PlusIcon } from "components/icons";
import { useGlobalStore } from "stores/global";
import { ArgyleLink } from "components/argyle-link";

export default function ConnectPage() {
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkInstance, setLinkInstance] = useState<any>();

  const getAccountId = useGlobalStore((state) => state.getAccountId);
  const router = useRouter();

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
    const accountId = getAccountId();

    if (accountId) {
      router.push("/early");
    }
  };

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
      <div className="px-4 pr-[92px]">
        <DecorativeIconWrapper>
          <PlusIcon />
        </DecorativeIconWrapper>
        <Heading className="mb-3">Let’s set up early pay</Heading>
        <Paragraph className="mb-6">
          Connect to all the places you work to maximize your daily payouts.
        </Paragraph>
        <div className={clsx("flex", linkLoading && "animate-pulse")}>
          <Button onClick={handleLinkOpen}>Connect your work</Button>
        </div>
        <Footnote className="mt-6">
          On the next screen, you will be able to search for your employer, work
          platform, or the payroll company that your employer uses to pay you.
        </Footnote>
      </div>
    </>
  );
}

ConnectPage.getLayout = function getLayout(page: ReactElement) {
  return <WithBackButton>{page}</WithBackButton>;
};
