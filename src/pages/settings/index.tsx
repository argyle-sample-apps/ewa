import type { ReactElement } from "react";
import Link from "next/link";
import { removeCookies } from "cookies-next";
import WithBackButton from "layouts/with-back-button";

import { Heading } from "components/typography";
import { InlineButton } from "components/button";

export default function SettingsPage() {
  const settings = [
    {
      label: "Personal",
      href: "/settings/personal",
    },
    {
      label: "Contact",
      href: "/settings/contact",
    },
    {
      label: "Deposit",
      href: "/settings/deposit",
    },
  ];

  return (
    <div className="px-4">
      <Heading className="mb-6">Settings</Heading>
      <div className="grid grid-cols-1 divide-y border-y">
        {settings.map((s) => (
          <Link key={s.href} href={s.href} passHref>
            <InlineButton as="a" className="py-3 !text-now-purple">
              {s.label}
            </InlineButton>
          </Link>
        ))}
      </div>
      <div className="mt-4">
        <InlineButton
          className="!text-red-600"
          onClick={() => {
            localStorage.clear();
            removeCookies("argyle-x-session");

            window.location.replace("/ewa/admin");
          }}
        >
          Delete my data
        </InlineButton>
      </div>
    </div>
  );
}

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <WithBackButton>{page}</WithBackButton>;
};
