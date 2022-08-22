declare global {
  interface Window {
    Argyle: any;
  }
}

import { useEffect, useState } from "react";
import Script from "next/script";
import { useGlobalStore } from "stores/global";
import { useEphemeralStore } from "stores/ephemeral";
import { fetchUnitByUserId, useUnit } from "hooks/useUnit";
import {
  CredentialsHints,
  SamplePasswordButton,
} from "views/credentials-hints";
import { useQueryClient } from "@tanstack/react-query";

type ArgyleLinkProps = {
  payDistributionUpdateFlow: boolean;
  onClose: () => void;
  onLinkInit: (link: any) => void;
  linkItemId: string | null;
};

export function ArgyleLink({
  payDistributionUpdateFlow,
  onClose,
  onLinkInit,
  linkItemId,
}: ArgyleLinkProps) {
  const addAccountId = useGlobalStore((state) => state.addAccountId);
  const addLinkItemId = useGlobalStore((state) => state.addLinkItemId);
  const setUser = useGlobalStore((state) => state.setUser);
  const userToken = useGlobalStore((state) => state.userToken);
  const isLinkLoaded = useEphemeralStore((state) => state.isLinkScriptLoaded);
  const confirmLinkIsLoaded = useEphemeralStore(
    (state) => state.confirmLinkIsLoaded
  );

  const queryClient = useQueryClient();

  const [showHints, setShowHints] = useState(false);
  const [showHintsButton, setShowHintsButton] = useState(false);

  const { data: unit } = useUnit({
    enabled: payDistributionUpdateFlow,
  });

  const handleUIEvent = (event: any) => {
    switch (event.name) {
      case "search - opened":
      case "success - opened":
      case "pd success - opened":
        setShowHintsButton(false);
        break;

      case "login - opened":
      case "mfa - opened":
        setShowHintsButton(true);
        break;

      case "link closed":
        setShowHintsButton(false);
        setShowHints(false);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (isLinkLoaded) {
      const payDistributionOptions = payDistributionUpdateFlow
        ? {
            payDistributionUpdateFlow: true,
            payDistributionConfig: unit?.encryptedConfig,
            linkItems: [linkItemId],
          }
        : {
            payDistributionUpdateFlow: false,
            linkItems: [],
          };

      const link = window.Argyle.create({
        customizationId: process.env.NEXT_PUBLIC_ARGYLE_CUSTOMIZATION_ID,
        pluginKey: process.env.NEXT_PUBLIC_ARGYLE_LINK_KEY,
        apiHost: process.env.NEXT_PUBLIC_ARGYLE_BASE_URL,
        userToken: userToken || "",
        payDistributionAutoTrigger: true,
        ...payDistributionOptions,
        onUserCreated: async ({
          userId,
          userToken,
        }: {
          userId: string;
          userToken: string;
        }) => {
          setUser(userId, userToken);

          await queryClient.prefetchQuery(["unit", userId], () =>
            fetchUnitByUserId(userId)
          );
        },
        onAccountConnected: async ({
          userId,
          accountId,
          linkItemId,
        }: {
          userId: string;
          accountId: string;
          linkItemId: string;
        }) => {
          addAccountId(accountId);
          addLinkItemId(linkItemId);
          queryClient.invalidateQueries(["accounts"]);
        },
        onPayDistributionSuccess: () => {
          queryClient.invalidateQueries(["accounts"]);
        },
        onUIEvent: handleUIEvent,
        onClose,
      });

      onLinkInit(link);
    }
  }, [userToken, isLinkLoaded, payDistributionUpdateFlow, linkItemId, unit]);

  return (
    <>
      <CredentialsHints isOpen={showHints} />
      <SamplePasswordButton
        showHintsButton={showHintsButton}
        showHints={showHints}
        onClick={() => setShowHints(!showHints)}
      />
      <Script
        // src="https://plugin.argyle.com/argyle.web.v3.js"
        src={process.env.NEXT_PUBLIC_ARGYLE_LINK_SCRIPT}
        onLoad={() => confirmLinkIsLoaded()}
      />
    </>
  );
}
