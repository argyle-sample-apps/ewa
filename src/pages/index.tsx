import type { ReactElement } from "react";
import Fullscreen from "layouts/fullscreen";
import { BRAND_NAME } from "consts";

export default function Index() {
  return <div>{BRAND_NAME}</div>;
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <Fullscreen>{page}</Fullscreen>;
};
