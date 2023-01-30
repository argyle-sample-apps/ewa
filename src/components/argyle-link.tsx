declare global {
  interface Window {
    Argyle: any;
  }
}

import { useCallback, useEffect, useMemo, useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import {
  CredentialsHints,
  SamplePasswordButton,
} from "views/credentials-hints";
import { ArgyleLinkProps } from "models/link-config";
import { clearCookies } from "utils";
import { linkScriptLoadedAtom } from "stores/global";

type BaseConfig = Pick<
  ArgyleLinkProps,
  | "customizationId"
  | "linkKey"
  | "apiHost"
  | "onUIEvent"
  | "onTokenExpired"
  | "userToken"
>;

type ArgyleLinkCustomConfig = Omit<ArgyleLinkProps, keyof BaseConfig>;

type ArgyleLinkComponentProps = {
  customConfig: ArgyleLinkCustomConfig;
  onLinkInit: (link: any) => void;
};

export type LinkInstance = {
  id: string;
  link: any;
};

const MAX_AGE = { maxAge: 60 * 60 * 24 };

export function ArgyleLink({
  customConfig,
  onLinkInit,
}: ArgyleLinkComponentProps) {
  const router = useRouter();

  const queryClient = useQueryClient();
  const userToken = getCookie("argyle-x-user-token") as string;

  const isLinkScriptLoaded = useAtomValue(linkScriptLoadedAtom);

  const [showHints, setShowHints] = useState(false);
  const [showHintsButton, setShowHintsButton] = useState(false);

  const handleUIEvent = useCallback((event: any) => {
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
  }, []);

  const handleExpiredToken = useCallback(() => {
    clearCookies();
    router.push("/admin");
  }, [router]);

  const baseConfig: BaseConfig = useMemo(() => {
    return {
      customizationId: process.env.NEXT_PUBLIC_ARGYLE_CUSTOMIZATION_ID,
      linkKey: process.env.NEXT_PUBLIC_ARGYLE_LINK_KEY,
      apiHost: process.env.NEXT_PUBLIC_ARGYLE_BASE_URL,
      userToken: userToken || "",
      onUIEvent: handleUIEvent,
      onTokenExpired: handleExpiredToken,
    };
  }, [handleExpiredToken, handleUIEvent, userToken]);

  const callbacksConfig = useMemo(() => {
    return {
      onUserCreated: ({ userId, userToken }: any) => {
        setCookie("argyle-x-user-id", userId, MAX_AGE);
        setCookie("argyle-x-user-token", userToken, MAX_AGE);
      },
      onAccountCreated: ({ accountId, linkItemId }: any) => {
        setCookie("argyle-x-account-id", accountId, MAX_AGE);
        setCookie("argyle-x-link-item-id", linkItemId, MAX_AGE);
      },
      onAccountConnected: async ({}: {}) => {
        queryClient.invalidateQueries();
      },
      onAccountUpdated: () => {
        queryClient.invalidateQueries();
      },
      onAccountRemoved: () => {
        queryClient.invalidateQueries();
      },
      onPayDistributionSuccess: () => {
        queryClient.invalidateQueries();
      },
    };
  }, [queryClient]);

  useEffect(() => {
    if (isLinkScriptLoaded) {
      const link = window.Argyle.create({
        ...baseConfig,
        ...callbacksConfig,
        ...customConfig,
      });

      onLinkInit(link);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLinkScriptLoaded]);

  return (
    <>
      <CredentialsHints showHints={showHints} setShowHints={setShowHints} />
      <SamplePasswordButton
        showHintsButton={showHintsButton}
        showHints={showHints}
        onClick={() => setShowHints(!showHints)}
      />
    </>
  );
}
