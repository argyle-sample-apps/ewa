import { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import axios from "axios";
import Head from "next/head";
import Script from "next/script";
import { AnimatePresence, domAnimation, LazyMotion } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorBoundary } from "react-error-boundary";

import "../styles/globals.css";
import { useSetAtom } from "jotai";
import { Button } from "components/button";
import { Subheading } from "components/typography";
import { FadeAnimation } from "components/fade-animation";
import { sleep, clearCookies } from "utils";
import {
  BASE_PATH,
  META_TITLE,
  META_DESCRIPTION,
  META_IMAGE,
  META_URL,
} from "consts";
import { linkScriptLoadedAtom } from "stores/global";

axios.defaults.baseURL = BASE_PATH;

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function ErrorFallback({ resetErrorBoundary }: any) {
  return (
    <div role="alert" className="p-4">
      <Subheading>Something went wrong</Subheading>
      <div className="mt-8">
        <Button onClick={resetErrorBoundary}>Try again</Button>
      </div>
    </div>
  );
}

const queryClient = new QueryClient();

function MyApp({ Component, pageProps, router }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  const setIsLinkScriptLoaded = useSetAtom(linkScriptLoadedAtom);

  return getLayout(
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta property="title" content={META_TITLE} />
        <meta name="description" content={META_DESCRIPTION} />
        <title>{META_TITLE}</title>

        <meta property="og:type" content="website" />
        <meta property="og:url" content={META_URL} />
        <meta property="og:title" content={META_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:image" content={META_IMAGE} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={META_URL} />
        <meta property="twitter:title" content={META_TITLE} />
        <meta property="twitter:description" content={META_DESCRIPTION} />
        <meta property="twitter:image" content={META_IMAGE} />

        <link rel="manifest" href={BASE_PATH + "/manifest.json"} />
        <link
          rel="preload"
          href={BASE_PATH + "/fonts/CircularXXWebLight.woff2"}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={BASE_PATH + "/fonts/CircularXXWebMedium.woff2"}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={BASE_PATH + "/fonts/CircularXXWebRegular.woff2"}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="apple-touch-icon"
          href={BASE_PATH + "/apple-icon.png"}
        ></link>
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Script
        src={process.env.NEXT_PUBLIC_ARGYLE_LINK_SCRIPT}
        onLoad={() => setIsLinkScriptLoaded(true)}
      />
      <QueryClientProvider client={queryClient}>
        <LazyMotion features={domAnimation}>
          <AnimatePresence exitBeforeEnter={false}>
            <FadeAnimation name={router.route}>
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={async () => {
                  localStorage.clear();
                  clearCookies();

                  await sleep(500);

                  window.location.replace("/ewa/admin");
                }}
              >
                <Component {...pageProps} />
              </ErrorBoundary>
            </FadeAnimation>
          </AnimatePresence>
        </LazyMotion>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
