import type { ReactElement } from "react";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { Paragraph, Strong, Footnote } from "./typography";
import { Splitter } from "components/splitter";
import { ChevronRight } from "components/icons";

export type ListElementProps = {
  id: number;
  primary: string;
  secondary: string;
  logo: string;
  aside?: string;
  url?: string;
};

export const ListElement = ({
  primary,
  secondary,
  aside,
  logo,
  url,
}: ListElementProps) => {
  return (
    <Link href={url ? url : "#"}>
      <a
        className="flex items-center py-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img className="mr-4 h-8 w-8 rounded-full" src={logo} alt={primary} />
        <div className="flex flex-1 justify-between">
          <div>
            <Strong className="text-sm">{primary}</Strong>
            <Paragraph className="text-sm">{secondary}</Paragraph>
          </div>
          <Paragraph className="text-sm">{aside}</Paragraph>
        </div>
      </a>
    </Link>
  );
};

export type ListProps = {
  elements: ListElementProps[];
};

export const List = ({ elements }: ListProps) => {
  return (
    <div className="divide-y border-y">
      {elements.map((element) => (
        <ListElement key={element.id} {...element} />
      ))}
    </div>
  );
};

type ListItemProps = {
  icon: ReactElement;
  url: string;
  label: string;
};

export const LinkList = ({ list }: { list: ListItemProps[] }) => {
  return (
    <div>
      <Splitter />
      <ul>
        {list.map((flow) => (
          <React.Fragment key={flow.url}>
            <li>
              <Link href={flow.url}>
                <a className="flex justify-between py-4 transition-all">
                  <div className="flex">
                    {flow.icon}
                    <Paragraph large className="ml-4">
                      {flow.label}
                    </Paragraph>
                  </div>
                  <ChevronRight />
                </a>
              </Link>
            </li>
            <Splitter />
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

type ListItemWithIconProps = {
  icon: ReactElement;
  label: string;
  description: string;
};

type ListItemWithIconAndDataProps = ListItemWithIconProps & {
  amount: string;
  accounts: string[];
  href: string;
  disabled: boolean;
};

export const ListItemWithIcon = ({
  icon,
  label,
  description,
}: ListItemWithIconProps) => {
  return (
    <div className="grid grid-cols-listItemWithIcon py-5">
      <div>{icon}</div>
      <div className="mr-5 ">
        <Paragraph className="mb-1 text-black">{label}</Paragraph>
        <Footnote className="text-gray-T50">{description}</Footnote>
      </div>
    </div>
  );
};

export const ListItemWithIconAndData = ({
  icon,
  label,
  description,
  amount,
  accounts,
  href,
  disabled,
}: ListItemWithIconAndDataProps) => {
  return (
    <Link href={href} passHref>
      <a
        className={clsx(
          "grid grid-cols-listItemWithIconAndData py-5",
          disabled && "pointer-events-none opacity-40"
        )}
      >
        <div>{icon}</div>
        <div className="mr-5 ">
          <Paragraph className="mb-1 text-black">{label}</Paragraph>
          <Footnote className="text-gray-T50">{description}</Footnote>
        </div>
        <div>
          <div className="text-end">{amount}</div>
          <div className="mt-2 flex justify-end">
            {accounts.map((account) => {
              return (
                <img
                  key={account}
                  src={account}
                  alt="Account logo"
                  className="ml-1 block h-5 w-5 rounded-full bg-black"
                />
              );
            })}
          </div>
        </div>
        <div className="ml-2">
          <ChevronRight />
        </div>
      </a>
    </Link>
  );
};

export const IconList = ({
  list,
  className,
}: {
  list: ListItemWithIconProps[];
  className?: string;
}) => {
  return (
    <div className={clsx(className)}>
      <Splitter />
      {list.map(({ icon, label, description }, i) => (
        <React.Fragment key={label + i}>
          <ListItemWithIcon
            icon={icon}
            label={label}
            description={description}
          />
          <Splitter />
        </React.Fragment>
      ))}
    </div>
  );
};
