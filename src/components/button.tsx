import { forwardRef, ButtonHTMLAttributes } from "react";
import Link from "next/link";
import clsx from "clsx";

export const buttonColors = {
  GREEN: "green",
  GRAY: "gray",
  DISABLED: "disabled",
  BLACK: "black",
};

const getButtonStyles = (color: string | undefined) => {
  switch (color) {
    case buttonColors.GREEN:
      return "bg-green text-white";
    case buttonColors.GRAY:
      return "bg-gray-T08 text-black";
    case buttonColors.DISABLED:
      return "bg-gray-30 text-black";
    default:
      return "bg-black text-white";
  }
};

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  as?: React.ElementType;
  disabled?: boolean;
  className?: string;
  color?: string | undefined;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef(
  (
    {
      onClick,
      href,
      children,
      as = href ? "a" : "button",
      disabled = false,
      className,
      color,
    }: ButtonProps,
    ref
  ) => {
    const Element = as;
    const buttonStyle = disabled ? buttonColors.DISABLED : color;
    const component = (
      <Element
        href={href}
        onClick={disabled ? () => {} : onClick}
        ref={ref}
        disabled={disabled}
        className={clsx(
          `mt-4 block w-full py-3 px-6 text-center text-xl transition-all ${getButtonStyles(
            buttonStyle
          )}`,
          className
        )}
      >
        {children}
      </Element>
    );

    if (href) {
      return <Link href={href}>{component}</Link>;
    }
    return component;
  }
);

export const InlineButton = forwardRef(
  (
    {
      onClick,
      href,
      children,
      as = "button",
      disabled = false,
      className,
    }: ButtonProps,
    ref
  ) => {
    const Element = as;
    return (
      <Element
        href={href}
        onClick={disabled ? () => {} : onClick}
        ref={ref}
        className={clsx("block text-xl text-orange-dark", className, {
          "opacity-30": disabled,
        })}
      >
        {children}
      </Element>
    );
  }
);

Button.displayName = "Button";
InlineButton.displayName = "InlineButton";
