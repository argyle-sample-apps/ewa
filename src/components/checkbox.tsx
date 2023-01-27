import React from "react";
import { Splitter } from "./splitter";
import { Paragraph } from "./typography";
import { EmptyCheckmarkIcon, CheckedIcon, CancelIcon } from "./icons";

export const variants = {
  CHECKED: "checked",
  ERROR: "error",
  UNCHECKED: "unchecked",
};

type CheckboxProps = {
  variant?: string | undefined;
  children: React.ReactNode;
};

export const Checkbox = ({ variant, children }: CheckboxProps) => {
  const ItemWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="my-1 flex items-center">{children}</div>
  );

  switch (variant) {
    case variants.CHECKED:
      return (
        <ItemWrapper>
          <CheckedIcon />
          <Paragraph className="ml-2 text-green">{children}</Paragraph>
        </ItemWrapper>
      );
    case variants.ERROR:
      return (
        <ItemWrapper>
          <CancelIcon />
          <Paragraph className="ml-2 text-red-60">{children}</Paragraph>
        </ItemWrapper>
      );
    case variants.UNCHECKED:
    default:
      return (
        <ItemWrapper>
          <EmptyCheckmarkIcon />
          <Paragraph className="ml-2 text-gray-50">{children}</Paragraph>
        </ItemWrapper>
      );
  }
};

type ChecklistProps = {
  className?: string;
  items: {
    id: number;
    text: string | React.ReactNode;
    variant?: string;
    other?: any;
  }[];
};

export const Checklist = ({ className, items }: ChecklistProps) => {
  return (
    <div className={className}>
      <Splitter className="mb-3" />
      {items.map(({ id, text, variant, other }) => (
        <React.Fragment key={id}>
          <Checkbox variant={variant}>{text}</Checkbox>
          {other}
        </React.Fragment>
      ))}
      <Splitter className="mt-3" />
    </div>
  );
};
