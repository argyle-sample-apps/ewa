import { ReactElement, useEffect, useState } from "react";
import clsx from "clsx";
import CurrencyInput from "react-currency-input-field";
import Fullscreen from "layouts/fullscreen";
import { useRouter } from "next/router";
import { Button } from "components/button";
import { Heading, Paragraph } from "components/typography";
import { Splitter } from "components/splitter";
import { setCookies } from "cookies-next";
import { useConfig } from "hooks/useConfig";
import { Tab } from "@headlessui/react";

type ZeroOne = 0 | 1;

function getKeyByValue(object: any, value: string) {
  return Object.keys(object).find((key) => object[key] === value);
}

const CYCLES = {
  0: "month",
  1: "week"
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
  }, []);

  const handleSubmit = async () => {
    const payCycle = CYCLES[payCycleAsNumber as ZeroOne];
    const durationCycle = CYCLES[durationCycleAsNumber as ZeroOne];

    const config = {
      pay: pay,
      duration: duration,
      pay_cycle: payCycle,
      duration_cycle: durationCycle
    };

    const stringified = JSON.stringify(config);

    setCookies("argyle-x-session", stringified, { maxAge: 60 * 6 * 24 });

    router.push("/onboarding/connect");
  };

  return (
    <div className="px-4 pt-8">
      <Heading className="mb-3 w-2/3">Early pay configuration</Heading>
      <Paragraph className="mb-6">
        Set the salary and job tenure values that will be used in the demo to
        determine if the applicant is eligible for early pay.
      </Paragraph>
      <Splitter />
      <div className="mt-4">
        <label className="mb-6 block">
          <span className="text-sm font-normal text-gray-400">
            Applicant earns at least:
          </span>
          <div className="flex items-baseline justify-between">
            <CurrencyInput
              className="mt-1 mr-4 block w-24 border-0 border-b-2 border-gray-200 px-0.5 focus:border-black focus:ring-0"
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
            <span> per </span>
            <Tab.Group
              selectedIndex={payCycleAsNumber}
              onChange={setPayCycleAsNumber}
            >
              <Tab.List className="ml-4 space-x-3 rounded-full bg-gray-100 p-1.5">
                {Object.values(CYCLES).map((cycle) => (
                  <Tab
                    key={cycle}
                    className={({ selected }) =>
                      clsx(
                        "rounded-full py-1 px-3",
                        selected ? "bg-now-darkest text-white" : "text-black"
                      )
                    }
                  >
                    {cycle}
                  </Tab>
                ))}
              </Tab.List>
            </Tab.Group>
          </div>
        </label>
        <label className="mb-6 block">
          <span className="text-sm font-normal text-gray-400">
            Applicant’s job tenure is at least:
          </span>
          <div className="flex items-baseline justify-between">
            <input
              type="number"
              className={clsx(
                "mt-1 mr-4 block w-24 border-0 border-b-2 border-gray-200 px-0.5 focus:border-black focus:ring-0"
              )}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <Tab.Group
              selectedIndex={durationCycleAsNumber}
              onChange={setDurationCycleAsNumber}
            >
              <Tab.List className="ml-4 space-x-3 rounded-full bg-gray-100 p-1.5">
                {Object.values(CYCLES).map((cycle) => (
                  <Tab
                    key={cycle}
                    className={({ selected }) =>
                      clsx(
                        "rounded-full py-1 px-3",
                        selected ? "bg-now-darkest text-white" : "text-black"
                      )
                    }
                  >
                    {cycle}s
                  </Tab>
                ))}
              </Tab.List>
            </Tab.Group>
          </div>
        </label>
      </div>
      <Splitter />
      <div className={clsx("mt-6 flex items-center")}>
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
}

AdminPage.getLayout = function getLayout(page: ReactElement) {
  return <Fullscreen>{page}</Fullscreen>;
};
