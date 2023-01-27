import clsx from "clsx";

type TypographyProps = {
  children: React.ReactNode;
  className?: string;
  large?: boolean | undefined;
  small?: boolean | undefined;
};

export const Title = ({ children, className }: TypographyProps) => {
  return (
    <h1 className={clsx("text-title tracking-[-.01em]", className)}>
      {children}
    </h1>
  );
};

export const Heading = ({ children, className }: TypographyProps) => {
  return (
    <h2
      className={clsx("text-heading font-normal tracking-[-.01em]", className)}
    >
      {children}
    </h2>
  );
};

export function Subheading({ children, className }: TypographyProps) {
  return (
    <h3
      className={clsx("text-subheading font-normal text-gray-T50", className)}
    >
      {children}
    </h3>
  );
}

const getParagraphSizes = (
  large: boolean | undefined,
  small: boolean | undefined
) => {
  switch (true) {
    case large:
      return "text-largeParagraph";
    case small:
      return "text-smallParagraph";
    default:
      return "text-base";
  }
};

export const Paragraph = ({
  children,
  className,
  large,
  small,
}: TypographyProps) => {
  return (
    <p className={clsx(getParagraphSizes(large, small), className)}>
      {children}
    </p>
  );
};

export const Subparagraph = ({ children, className }: TypographyProps) => {
  return (
    <p className={clsx("text-sm font-normal text-black", className)}>
      {children}
    </p>
  );
};

export const Footnote = ({ children, className }: TypographyProps) => {
  return (
    <h4 className={clsx("text-xs font-normal text-gray-50", className)}>
      {children}
    </h4>
  );
};

export const Strong = ({ children, className }: TypographyProps) => {
  return (
    <span className={clsx("font-medium text-black", className)}>
      {children}
    </span>
  );
};
