import { ReactElement, useEffect, useState } from "react";
import clsx from "clsx";
import CurrencyInput from "react-currency-input-field";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { Tab } from "@headlessui/react";
import Fullscreen from "layouts/fullscreen";
import { Button, buttonColors } from "components/button";
import { Heading, Paragraph } from "components/typography";
import { useConfig } from "hooks/useConfig";

type ZeroOne = 0 | 1;

function getKeyByValue(object: any, value: string) {
  return Object.keys(object).find((key) => object[key] === value);
}

const CYCLES = {
  0: "month",
  1: "week",
};

export default function AdminPage() {
  const router = useRouter();

  const [pay, setPay] = useState<string | undefined>("");
  const [duration, setDuration] = useState<string | undefined>("");
  const [payCycleAsNumber, setPayCycleAsNumber] = useState<number>(0);
  const [durationCycleAsNumber, setDurationCycleAsNumber] = useState<number>(0);

  const config = useConfig();

  useEffect(() => {
    if (config) {
      const payCycleAsNumber = Number(
        getKeyByValue(CYCLES, config.pay_cycle)
      ) as ZeroOne;
      const durationCycleAsNumber = Number(
        getKeyByValue(CYCLES, config.duration_cycle)
      ) as ZeroOne;

      setPay(String(config.pay));
      setDuration(String(config.duration));
      setPayCycleAsNumber(payCycleAsNumber);
      setDurationCycleAsNumber(durationCycleAsNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    const payCycle = CYCLES[payCycleAsNumber as ZeroOne];
    const durationCycle = CYCLES[durationCycleAsNumber as ZeroOne];

    const config = {
      pay: pay,
      duration: duration,
      pay_cycle: payCycle,
      duration_cycle: durationCycle,
    };

    const stringified = JSON.stringify(config);

    setCookie("argyle-x-session", stringified, { maxAge: 60 * 6 * 24 });

    router.push("/onboarding");
  };

  return (
    <div className="flex h-full flex-col px-5 pb-5">
      <Heading className="mb-3 mt-[60px]">Before you begin</Heading>
      <Paragraph large className="text-gray-T50">
        Set the salary and job tenure values that will be used in the demo to
        determine if the applicant is eligible for early pay.
      </Paragraph>
      <div className="mt-5">
        <label className="mb-4 flex justify-between bg-gray-T04 pl-[12px] pr-1.5">
          <div className="">
            <span className="text-xs font-normal text-gray-T40">
              Minimum income
            </span>
            <CurrencyInput
              className="mr-4 block w-24 border-0 bg-transparent px-0.5 pt-0 font-sans text-[20px] focus:border-none focus:ring-0"
              autoFocus
              allowDecimals={false}
              placeholder="$500"
              value={pay}
              maxLength={7}
              prefix="$"
              onValueChange={(value) => {
                setPay(value);
              }}
            />
          </div>
          <Tab.Group
            selectedIndex={payCycleAsNumber}
            onChange={setPayCycleAsNumber}
          >
            <Tab.List className="flex">
              <Tab
                className={({ selected }) =>
                  clsx("px-1.5", selected ? "text-black" : "text-gray-T40")
                }
              >
                Monthly
              </Tab>
              <Tab
                className={({ selected }) =>
                  clsx("px-1.5", selected ? "text-black" : "text-gray-T40")
                }
              >
                Weekly
              </Tab>
            </Tab.List>
          </Tab.Group>
        </label>
        <label className="mb-4 flex justify-between bg-gray-T04 pl-[12px] pr-1.5">
          <div>
            <span className="text-xs font-normal text-gray-T40">
              Minimum job tenure
            </span>

            <input
              type="number"
              className={clsx(
                "mr-4 block w-24 border-0 bg-transparent px-0.5 pt-0 font-sans text-[20px] focus:border-none focus:ring-0"
              )}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <Tab.Group
            selectedIndex={durationCycleAsNumber}
            onChange={setDurationCycleAsNumber}
          >
            <Tab.List className="flex">
              <Tab
                className={({ selected }) =>
                  clsx("px-1.5", selected ? "text-black" : "text-gray-T40")
                }
              >
                Months
              </Tab>
              <Tab
                className={({ selected }) =>
                  clsx("px-1.5", selected ? "text-black" : "text-gray-T40")
                }
              >
                Weeks
              </Tab>
            </Tab.List>
          </Tab.Group>
        </label>
      </div>
      <div className={clsx("mt-auto flex")}>
        <Button color={buttonColors.GREEN} onClick={handleSubmit}>
          Start demo
        </Button>
      </div>
    </div>
  );
}

AdminPage.getLayout = function getLayout(page: ReactElement) {
  return <Fullscreen>{page}</Fullscreen>;
};
