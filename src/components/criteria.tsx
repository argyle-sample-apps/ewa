import { Loader, LoadingError } from "./loader";
import { PlatformIcon } from "./platform-icon";
import { AddMoreAccountsButton } from "./add-more-accounts-button";
import { useAccounts } from "hooks/useAccounts";
import { useConfig } from "hooks/useConfig";
import { useEarlyPay } from "hooks/useEarlyPay";
import { Checklist, variants } from "components/checkbox";
import { formatCurrency } from "utils";
import { CHECKLIST_ITEMS } from "consts";

export const Criteria = () => {
  const {
    data: decision,
    isLoading: isEarlyPayLoading,
    isError: isEarlyPayError,
  } = useEarlyPay();
  const {
    data: accounts,
    isLoading: isAccountsLoading,
    isError: isAccountsError,
  } = useAccounts();
  const config = useConfig();

  if (isAccountsLoading || isEarlyPayLoading) {
    return <Loader />;
  }

  if (isEarlyPayError || isAccountsError) {
    return <LoadingError />;
  }

  const AccountList = () => (
    <div className="ml-7 flex">
      {accounts.connected.map((account) => {
        const linkItem = account.link_item_details;
        return (
          <div key={account.id} className={"flex items-center pr-2"}>
            <PlatformIcon src={linkItem.logo_url} alt={linkItem.name} />
          </div>
        );
      })}
      <AddMoreAccountsButton />
    </div>
  );

  const checklistItems = [
    {
      id: CHECKLIST_ITEMS[0].id,
      text: CHECKLIST_ITEMS[0].text,
      variant: variants.CHECKED,
    },
    {
      id: CHECKLIST_ITEMS[1].id,
      text: CHECKLIST_ITEMS[1].text,
      variant: variants.CHECKED,
      other: <AccountList />,
    },
    {
      id: CHECKLIST_ITEMS[2].id,
      text: `Job tenure at least ${config.duration} ${config.duration_cycle}s`,
      variant: decision.criteria.duration ? variants.CHECKED : variants.ERROR,
    },
    {
      id: CHECKLIST_ITEMS[3].id,
      text: `Earn at least ${formatCurrency(config.pay)} per ${
        config.pay_cycle
      }`,
      variant: decision.criteria.pay ? variants.CHECKED : variants.ERROR,
    },
    {
      id: CHECKLIST_ITEMS[4].id,
      text: CHECKLIST_ITEMS[4].text,
      variant: accounts.isPdConfigured ? variants.CHECKED : variants.UNCHECKED,
    },
  ];

  return <Checklist items={checklistItems} className="mb-5" />;
};
