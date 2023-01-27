import { ReactElement } from "react";
import { useRouter } from "next/router";
import Fullscreen from "layouts/fullscreen";
import { Button } from "components/button";
import { Heading, Subheading } from "components/typography";
import { IconList } from "components/list";
import { EarlyOnIcon, BoltIcon, BackInTimeIcon } from "components/icons";

const items = [
  {
    icon: <BoltIcon />,
    label: "Shift and gig workers",
    description:
      "Can get all the money as soon as they earn it without any limitations.",
  },
  {
    icon: <BackInTimeIcon />,
    label: "Salary workers",
    description:
      "Can access up to 70% of their last paycheck on any day of the current pay cycle. This can be done once per pay cycle.",
  },
];

export default function Onboarding() {
  return (
    <div className="flex h-full flex-col px-5 pb-5">
      <div className="mt-auto ">
        <EarlyOnIcon />
        <Heading className="my-4">Early pay</Heading>
        <Subheading className="mb-4 text-gray-T50">
          Access your income as soon as you earn it.
        </Subheading>
        <IconList list={items} className="mb-14" />

        <Button href="onboarding/connect">Start demo</Button>
      </div>
    </div>
  );
}

Onboarding.getLayout = function getLayout(page: ReactElement) {
  return (
    <Fullscreen bg="green" logo>
      {page}
    </Fullscreen>
  );
};
