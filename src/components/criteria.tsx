import { useAccounts } from "hooks/useAccounts";
import { useConfig } from "hooks/useConfig";
import { useEarlyPay } from "hooks/useEarlyPay";
import { useGlobalStore } from "stores/global";
import { formatCurrency } from "utils";
import { Checkbox } from "./checkbox";

type CriteriaProps = {
  view?: "default" | "compact";
};

export const Criteria = ({ view = "default" }: CriteriaProps) => {
  const activeAccounts = useGlobalStore(
    (state) => state.earlypay.activeAccounts
  );
  const {
    data: decision,
    isLoading: isEarlyPayLoading,
    isError: isEarlyPayError,
  } = useEarlyPay({
    activeAccounts,
  });
  const {
    data: accounts,
    isLoading: isAccountsLoading,
    isError: isAccountsError,
  } = useAccounts();
  const config = useConfig();

  if (isAccountsLoading || isEarlyPayLoading) {
    return null;
  }

  if (isEarlyPayError || isAccountsError) {
    return <div>An error has occured. Try again</div>;
  }

  if (view === "compact") {
    return (
      <div>
        <Checkbox
          label={`Job tenure at least ${config.duration} ${config.duration_cycle}s`}
          checked={decision.criteria.duration}
        />
        <Checkbox
          label={`Earn at least ${formatCurrency(config.pay)} per ${
            config.pay_cycle
          }`}
          checked={decision.criteria.pay}
        />
      </div>
    );
  } else {
    return (
      <div>
        <Checkbox
          label={`Job tenure at least ${config.duration} ${config.duration_cycle}s`}
          checked={decision.criteria.duration}
        />
        <Checkbox
          label={`Earn at least ${formatCurrency(config.pay)}
           per ${config.pay_cycle}`}
          checked={decision.criteria.pay}
        />
        <Checkbox label="Connect your work account" checked={true} />
        <Checkbox
          label="Direct your income to GoodLoans"
          checked={accounts.isPdConfigured}
        />
      </div>
    );
  }
};
