import { ReactElement } from "react";
import { useRouter } from "next/router";
import Fullscreen from "layouts/fullscreen";
import { Success } from "views/success";
export default function SuccessPage() {
  const router = useRouter();

  const { text, redirect } = router.query;

  return <Success text={text as string} href={redirect as string} />;
}

SuccessPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Fullscreen bg={"green"} logo>
      {page}
    </Fullscreen>
  );
};
