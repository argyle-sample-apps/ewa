import type { ReactElement } from "react";
import Fullscreen from "layouts/fullscreen";

export default function Index() {
  return <div>GoodLoans</div>;
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <Fullscreen>{page}</Fullscreen>;
};
