import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { PayAllocation } from "models/pay-allocation";
import { useGlobalStore } from "stores/global";
import { groupBy } from "utils";

const fetchPayAllocationsByUserId = async (userId: string) => {
  const { data } = await axios.get<PayAllocation[]>(
    `/api/pay-allocations/${userId}`
  );

  return groupBy(data, (allocation: any) => allocation.employer);
};

export function usePayAllocations() {
  const userId = useGlobalStore((state) => state.userId);

  return useQuery(["pay-allocations", userId], () =>
    fetchPayAllocationsByUserId(userId)
  );
}
