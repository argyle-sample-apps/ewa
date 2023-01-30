import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { PayAllocation } from "models/pay-allocation";
import { groupBy } from "utils";

const fetchPayAllocationsByUserId = async (userId: string) => {
  const { data } = await axios.get<PayAllocation[]>(
    `/api/pay-allocations/${userId}`
  );

  return groupBy(data, (allocation: any) => allocation.employer);
};

export function usePayAllocations() {
  const userId = getCookie("argyle-x-user-id") as string;

  return useQuery(["pay-allocations", userId], () =>
    fetchPayAllocationsByUserId(userId)
  );
}
