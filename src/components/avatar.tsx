import { useState } from "react";

export type UserAvatarProps = {
  isLoading?: boolean;
  src?: string | null;
  name?: string;
};

export const Avatar = ({
  isLoading,
  src = null,
  name = "",
}: UserAvatarProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(true);

  const getInitials = (fullName: any) => {
    const allNames = (fullName || "").trim().split(" ");
    const initials = allNames.reduce(
      (acc: any, curr: any, index: any) => {
        if (index === 0 || index === allNames.length - 1) {
          acc = `${acc}${curr.charAt(0).toUpperCase()}`;
        }
        return acc;
      },
      [""]
    );
    return initials;
  };

  return (
    <div className="rounded-full border border-gray-T12 p-[5px]">
      <div className="relative flex h-8 w-8 content-center items-center overflow-hidden rounded-full text-center">
        {src && isImageLoaded && (
          <img
            className="absolute top-0 right-0 left-0 bottom-0 h-full w-full overflow-hidden rounded-full  bg-misty-40 object-cover"
            onError={() => {
              setIsImageLoaded(false);
            }}
            alt={name}
            src={src}
          />
        )}
        {isLoading ? (
          <div className="h-8 w-8 animate-pulse rounded-full bg-misty-40" />
        ) : (
          <div className="h-[32px] w-[32px] overflow-hidden rounded-full bg-misty-40 ">
            <div className="m-auto ml-[-1px] h-[32px] w-[32px] pt-[5px] text-sm leading-5 text-white">
              {name && getInitials(name)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
