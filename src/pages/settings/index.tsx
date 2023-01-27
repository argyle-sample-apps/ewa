import { ReactElement, useState } from "react";
import { useAtom } from "jotai";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Link from "next/link";
import { getCookie } from "cookies-next";
import Fullscreen from "layouts/fullscreen";
import { useAccounts } from "hooks/useAccounts";
import { AddMoreAccountsButton } from "components/add-more-accounts-button";
import { Splitter } from "components/splitter";
import { Heading, Paragraph, Footnote } from "components/typography";
import { InlineButton } from "components/button";
import { Toggle, ToggleProps } from "components/toggle";
import { PlatformIcon } from "components/platform-icon";
import { Avatar } from "components/avatar";
import { useProfile } from "hooks/useProfile";
import { Loader, LoadingError } from "components/loader";
import {
  BoltIcon,
  TimeAutoIcon,
  ChevronRight,
  BackInTimeIcon,
} from "components/icons";
import { FeatureKeys, featuresAtom } from "stores/global";
import { clearCookies } from "utils";
import { LinkInstance, ArgyleLink } from "components/argyle-link";

type ToggleItemProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
} & Omit<ToggleProps, "id">;

const ToggleItem = ({
  title,
  description,
  icon,
  ...toggleProps
}: ToggleItemProps) => (
  <>
    <div className="grid grid-cols-listItemWithToggle py-5">
      <div className="flex h-full items-center">{icon}</div>
      <div className="mr-5 ">
        <Paragraph className="mb-1 text-black">{title}</Paragraph>
        <Footnote className="text-gray-T50">{description}</Footnote>
      </div>
      <div className="flex h-full items-center">
        <Toggle {...toggleProps} />
      </div>
    </div>
    <Splitter />
  </>
);

export default function SettingsPage() {
  const [instances, setInstances] = useState<LinkInstance[]>([]);
  const [features, setFeatures] = useAtom(featuresAtom);

  const toggleFeature = (feature: FeatureKeys) => {
    setFeatures((prev) => {
      return {
        ...prev,
        [feature]: !prev[feature],
      };
    });
  };

  const {
    data: accounts,
    isLoading: isAccountsLoading,
    isError: isAccountsError,
  } = useAccounts();
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useProfile();

  if (isProfileLoading || isAccountsLoading) {
    return <Loader />;
  }

  if (isProfileError || isAccountsError) {
    return <LoadingError />;
  }

  return (
    <div className="h-full px-4">
      <div className="flex items-center justify-between">
        <Heading className="py-6">Settings</Heading>
        <Link href="/settings/personal">
          <a>
            <Avatar src={profile.picture_url} name={profile.full_name} />
          </a>
        </Link>
      </div>
      <Paragraph small className="text-gray-T40">
        Manage connected accounts, enable different types of payments and change
        withdrawal limits.
      </Paragraph>
      <h3 className="mt-10 mb-4 text-[20px]">Connected accounts</h3>

      <div>
        {accounts?.connected.map((account) => {
          const linkItem = account.link_item_details;
          const instance = instances.find((i) => i.id === linkItem.id);

          return (
            <div key={account.id}>
              <ArgyleLink
                onLinkInit={(instance) => {
                  setInstances((prev) => [
                    ...prev,
                    { id: linkItem.id, link: instance },
                  ]);
                }}
                customConfig={{
                  linkItems: [linkItem.id],
                }}
              />

              <Splitter />
              <button
                onClick={() => instance?.link.open()}
                className="w-full text-left"
              >
                <div className="grid grid-cols-listItemWithChevron py-5">
                  <PlatformIcon src={linkItem.logo_url} alt={linkItem.name} />
                  <div className="flex h-full flex-col">
                    <Paragraph>{linkItem.name}</Paragraph>
                    <Footnote className="text-gray-T50 first-letter:uppercase">
                      {account.connection.status}
                    </Footnote>
                  </div>
                  <div className="flex h-full items-center">
                    <ChevronRight />
                  </div>
                </div>
              </button>
            </div>
          );
        })}
        <Splitter className="mb-4" />

        <AddMoreAccountsButton
          type="circle"
          title="Set up early pay for another employer"
        />
      </div>

      <h3 className="mt-14 mb-4 text-[20px]">On-demand payments</h3>
      <Splitter />
      <ToggleItem
        icon={<TimeAutoIcon />}
        title="Enable on-demand payments"
        description="Available for shift and gig workers"
        checked={features["on-demand"]}
        onChange={() => toggleFeature("on-demand")}
      />
      <ToggleItem
        icon={<BoltIcon />}
        title="Automatic transfers"
        description="Get what you earned daily"
        checked={features["automatic-transfers"]}
        onChange={() => toggleFeature("automatic-transfers")}
      />
      <h3 className="mt-14 mb-4 text-[20px]">One-time payments</h3>
      <Splitter />
      <ToggleItem
        icon={<BackInTimeIcon />}
        title="Enable one-time payments"
        description="Available for salary workers"
        checked={features["one-time"]}
        onChange={() => toggleFeature("one-time")}
      />
      <div className="mt-4 pb-6">
        <InlineButton
          className="!text-red-600"
          onClick={() => {
            localStorage.clear();
            clearCookies();

            window.location.replace("/ewa/admin");
          }}
        >
          Delete my data
        </InlineButton>
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

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Fullscreen navigation bg="gray">
      {page}
    </Fullscreen>
  );
};
