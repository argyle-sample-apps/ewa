import type { ReactElement } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getCookie } from "cookies-next";
import Fullscreen from "layouts/fullscreen";

import { ProfileInfo } from "views/profile-info";
import { DepositInfo } from "views/deposit-info";

export default function PersonalSettingsPage() {
  return (
    <div className="px-4">
      <ProfileInfo />
      <DepositInfo />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const userId = getCookie("argyle-x-user-id", ctx);

  if (!userId) {
    return {
      redirect: { destination: "/admin", permanent: false },
    };
  }

  return {
    props: {},
  };
};

PersonalSettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <Fullscreen back>{page}</Fullscreen>;
};
