import type { ReactElement } from "react";
import { useRouter } from "next/router";
import Fullscreen from "layouts/fullscreen";
import { formatCurrency } from "utils";
import { BRAND_NAME } from "consts";
import { Success } from "views/success";

export default function EarlyPaySuccessPage() {
  const router = useRouter();
  const { amount } = router.query as { amount: string };

  const text = `${BRAND_NAME} will deposit ${formatCurrency(amount)} to
      your account.`;

  return <Success href={"/early"} text={text} />;
}

EarlyPaySuccessPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Fullscreen bg={"green"} logo>
      {page}
    </Fullscreen>
  );
};
