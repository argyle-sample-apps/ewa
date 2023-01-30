import { useState } from "react";
import clsx from "clsx";

type Size = "small" | "medium" | "large";

const ICON_SIZES = {
  small: 20,
  medium: 28,
  large: 32,
};

export type PlatformIconProps = {
  src?: string | null;
  size?: Size;
  alt?: string;
  border?: boolean;
};

export const PlatformIcon = ({
  src = null,
  alt = "",
  size,
  border,
}: PlatformIconProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(true);

  return (
    <div
      className={clsx(
        "relative my-auto flex content-center items-center overflow-hidden rounded-full bg-gray-30 object-cover",
        size
          ? `w-[${ICON_SIZES[size]}px] h-[${ICON_SIZES[size]}px]`
          : "h-[32px] w-[32px]"
      )}
    >
      {src && isImageLoaded && (
        <img
          className="absolute top-0 right-0 left-0 bottom-0 h-full w-full overflow-hidden rounded-full object-cover"
          onError={() => {
            setIsImageLoaded(false);
          }}
          alt={alt}
          src={src}
        />
      )}
      <div
        className={clsx(
          "absolute top-0 right-0 left-0 bottom-0 h-full w-full overflow-hidden rounded-full  ",
          border ? "border-[2px] border-black" : "border-[1px] border-gray-T12"
        )}
      />
    </div>
  );
};
