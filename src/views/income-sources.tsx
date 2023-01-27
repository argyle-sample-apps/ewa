import currency from "currency.js";
import { formatISO, parseISO } from "date-fns";
import { DataPoint } from "components/data-point";
import { Splitter } from "components/splitter";
import { Paragraph } from "components/typography";
import { Account } from "models/account";
import { Employment } from "models/employment";
import { Payout } from "models/payout";

type IncomeSourcesProps = {
  accounts: Account[];
  employments: Employment[];
  payouts: Payout[];
};

export const IncomeSources = ({
  accounts,
  employments,
  payouts,
}: IncomeSourcesProps) => {
  const isEmployer = (account: Account) =>
    account.link_item_details.kind === "employer";
  const isPlatform = (account: Account) =>
    account.link_item_details.kind === "platform";

  const getDetails = (account: Account) => {
    let amount: number = 0;
    let period: string = "monthly";
    let startDate: string = formatISO(new Date());

    if (isEmployer(account) || isPlatform(account)) {
      // use employments
      const employment = employments.find(
        (employment) => employment.account === account.id
      );

      if (employment) {
        amount = Number(employment.base_pay.amount);
        period = employment.base_pay.period;
        startDate = employment.hire_datetime;
      }
    } else {
      // use payouts
      const amountFromPayouts = payouts
        .filter((payout) => payout.account === account.id)
        .reduce((acc: number, val: any) => {
          return acc + Number(val.gross_pay);
        }, 0);

      amount = amountFromPayouts;
      period = "monthly";

      if (account?.availability?.activities?.available_from) {
        startDate = account?.availability?.activities?.available_from;
      }
    }

    const startDateFormatted = startDate
      ? formatISO(parseISO(startDate), {
          representation: "date",
        })
      : "";

    return { amount, period, startDate: startDateFormatted };
  };
  return (
    <div>
      {accounts.map((account) => {
        const { amount, period, startDate } = getDetails(account);

        const linkItem = account?.link_item_details;

        return (
          <div key={account.id} className="mt-4">
            <div className="flex items-center justify-between">
              <Paragraph large className="text-black">
                {linkItem?.name}
              </Paragraph>
              <img
                className="mr-2 h-6 w-6 rounded-full"
                src={linkItem?.logo_url}
                alt={linkItem?.name}
              />
            </div>
            <div className="mt-4 flex gap-x-12">
              <DataPoint label="Start date" value={startDate} />
              <DataPoint
                label="Average pay"
                value={`${currency(amount, {
                  precision: 0,
                }).format()} ${period}`}
              />
            </div>
            <Splitter />
          </div>
        );
      })}
    </div>
  );
};
