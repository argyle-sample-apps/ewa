import currency from "currency.js";
import { formatSnakeCase } from "utils";
import { Heading, Paragraph, Subheading } from "components/typography";
import { DataPoint } from "components/data-point";
import { usePayAllocations } from "hooks/usePayAllocations";
import { PlatformIcon } from "components/platform-icon";
import { LineLoader, LoadingError } from "components/loader";

export function DepositInfo() {
  const { data: payAllocations, isLoading, isError } = usePayAllocations();

  if (isLoading) {
    return (
      <div className="mt-4 grid animate-pulse gap-10">
        {[1, 2, 3].map((el) => (
          <div key={el}>
            <div className="mb-2 h-3 w-20 rounded-full bg-gray-200"></div>
            <div className="h-4 w-32 rounded-full bg-gray-200"></div>
          </div>
        ))}
      </div>
    );
  }

  const Content = () => {
    if (isLoading) {
      return <LineLoader length={3} />;
    }

    if (isError) {
      return <LoadingError />;
    }

    function renderAllocationValue({ allocation_type, allocation_value }: any) {
      if (allocation_value === "remainder") {
        return "Remainder";
      }
      if (allocation_type === "percent") {
        return allocation_value + "%";
      } else {
        return currency(allocation_value).format();
      }
    }

    return (
      <>
        {Object.entries(payAllocations).map(([keyOrNull, allocations]: any) => {
          // TODO: fix this
          const key = keyOrNull === "null" ? null : keyOrNull;

          return (
            <div key={key} className="mb-6">
              <div className="flex items-center">
                {key && (
                  <PlatformIcon
                    src={`https://res.cloudinary.com/argyle-media/image/upload/v1600705681/partner-logos/${key}.png`}
                    alt={key}
                  />
                )}
                <Paragraph large className="ml-3">
                  {formatSnakeCase(key || "default account")}
                </Paragraph>
              </div>
              {allocations.map((allocation: any) => {
                return (
                  <div key={allocation.id}>
                    <div className="my-4">
                      <Paragraph>
                        <span className="text-purple">
                          {renderAllocationValue(allocation)}
                        </span>
                      </Paragraph>
                    </div>
                    <div className="flex gap-x-12">
                      <DataPoint
                        label="Account number"
                        value={allocation.bank_account.account_number}
                      />
                      <DataPoint
                        label="Routing number"
                        value={allocation.bank_account.routing_number}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      <Heading className="mb-6 mt-11">Deposit information</Heading>
      <Content />
    </>
  );
}
