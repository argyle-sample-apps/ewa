import { ReactElement } from "react";
import Fullscreen from "layouts/fullscreen";
import { Button } from "components/button";
import { Heading, Paragraph } from "components/typography";
import { LargeCheckedCircleIcon } from "components/icons";

export default function ErrorPage() {
  return (
    <div className="flex h-full flex-col p-5">
      <div className="mt-auto">
        <LargeCheckedCircleIcon />
        <Heading className="mb-4 mt-4 text-gray-T50">
          <span className="text-black">Oops.</span> Your direct deposit settings
          were changed and we are no longer receiving your income
        </Heading>
        <Paragraph large className="mb-4 text-gray-T50">
          To continue using our service, please switch your direct deposit.
        </Paragraph>
      </div>
      {/*  to do: ? which link?   */}
      <Button href={"/admin"}>Switch</Button>
    </div>
  );
}

ErrorPage.getLayout = function getLayout(page: ReactElement) {
  return (
    /*  to do: ? back button link?  */
    <Fullscreen bg={"red"} back>
      {page}
    </Fullscreen>
  );
};
