import clsx from "clsx";
import { Paragraph } from "./typography";
import { FadeAnimation } from "./fade-animation";

export const Loader = ({ title }: { title?: string }) => {
  return (
    <div className={"flex h-full select-none items-center justify-center"}>
      <div className="flex flex-col items-center">
        <FadeAnimation name={title ? title.concat("-loader") : "loader"}>
          <Spinner />
        </FadeAnimation>
        {title && <Paragraph className="mt-6 text-center">{title}</Paragraph>}
      </div>
    </div>
  );
};

export const Spinner = ({ className }: { className?: string }) => {
  return (
    <div className={clsx("flex h-full items-center justify-center", className)}>
      <div className="animate-spin">
        <img
          src={
            "https://res.cloudinary.com/argyle-media/image/upload/v1661963437/argyle-x/homepage/spinner.png"
          }
          alt="spinner"
          width="80"
          height="80"
          className="-scale-x-100 "
        />
      </div>
    </div>
  );
};

export const LineLoader = ({ length }: { length: number }) => {
  const rowCountArray = Array.from({ length }, (v, i) => i);
  return (
    <div className="grid animate-pulse gap-6">
      {rowCountArray.map((el) => (
        <div key={el}>
          <div className="mb-[2px] h-4 w-20 rounded-full bg-gray-T04"></div>
          <div className="h-6 w-32 rounded-full bg-gray-T08"></div>
        </div>
      ))}
    </div>
  );
};

export const LoadingError = () => {
  return (
    <Paragraph className="p-5">An error has occurred. Try again.</Paragraph>
  );
};
