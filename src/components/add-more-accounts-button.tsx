import { useState, useEffect } from "react";
import clsx from "clsx";
import { useQueryClient } from "@tanstack/react-query";
import { AddIconSized, SmallPlusCircleIcon } from "./icons";
import { ArgyleLink } from "components/argyle-link";
import { useLink } from "hooks/useLink";

type Types = "filled" | "circle";

export const AddMoreAccountsButton = ({
  type = "filled",
  title,
}: {
  type?: Types;
  title?: string;
}) => {
  const queryClient = useQueryClient();
  const { openLink, isLinkLoading, setIsLinkOpen, setLinkInstance } = useLink();

  const handleLinkClose = () => {
    setIsLinkOpen(false);
    queryClient.invalidateQueries(["accounts"]);
    queryClient.invalidateQueries(["early-pay"]);
  };

  return (
    <>
      <ArgyleLink
        onLinkInit={(link) => {
          setLinkInstance(link);
        }}
        customConfig={{
          onClose: () => handleLinkClose(),
        }}
      />

      <div className={clsx(isLinkLoading && "animate-pulse")}>
        {type === "filled" ? (
          <button
            onClick={openLink}
            className="flex h-8 w-8 content-center items-center justify-center rounded-full bg-misty-10"
          >
            <AddIconSized size={14} />
          </button>
        ) : (
          <button onClick={openLink} className="flex">
            <div className="h-6 w-6">
              <SmallPlusCircleIcon />
            </div>

            <span className="pl-4">{title}</span>
          </button>
        )}
      </div>
    </>
  );
};
