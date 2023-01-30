import { ReactElement, useState } from "react";
import { useAtom } from "jotai";
import Link from "next/link";
import Fullscreen from "layouts/fullscreen";
import { useAccounts } from "hooks/useAccounts";
import { AddMoreAccountsButton } from "components/add-more-accounts-button";
import { Splitter } from "components/splitter";
import { Heading, Paragraph, Footnote } from "components/typography";
import { Button, InlineButton } from "components/button";
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
import { LinkInstance, ArgyleLink } from "components/argyle-link";

const links = ["amazon", "uber"];

export default function SettingsPage() {
  const [instances, setInstances] = useState<LinkInstance[]>([]);

  return (
    <div className="h-full px-4">
      {links.map((link) => {
        const instance = instances.find((i) => i.id === link);
        return (
          <div key={link}>
            <ArgyleLink
              onLinkInit={(instance) => {
                setInstances((prev) => [...prev, { id: link, link: instance }]);
              }}
              customConfig={{
                linkItems: [link],
                payDistributionAutoTrigger: true,
                payDistributionUpdateFlow: true,
              }}
            />
            <Button onClick={() => instance?.link.open()}>Open {link}</Button>
          </div>
        );
      })}
    </div>
  );
}

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Fullscreen navigation bg="gray">
      {page}
    </Fullscreen>
  );
};
