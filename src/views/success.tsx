import { Button } from "components/button";
import { Heading, Paragraph } from "components/typography";
import { CheckIcon } from "components/icons";

export const Success = ({
  href,
  text,
}: {
  href: string;
  text: string | React.ReactElement;
}) => {
  return (
    <div className="flex h-full flex-col p-5">
      <div className="mt-auto">
        <CheckIcon />
        <Heading className="mb-4 mt-4">Success</Heading>
        <Paragraph large className="mb-4 text-gray-T50">
          {text}
        </Paragraph>
      </div>
      <Button href={href}>Done</Button>
    </div>
  );
};
