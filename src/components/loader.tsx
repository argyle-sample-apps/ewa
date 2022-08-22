import { LogotypeIcon } from "./icons";
import { Subheading } from "./typography";

export function Loader() {
  return (
    <div className="flex h-full items-center justify-center py-24 px-16">
      {/* <div className="w-32 animate-pulse animate-spin">
        <LogotypeIcon />
      </div> */}
      <div className="flex flex-col items-center">
        <div className="loader h-32 w-32 rounded-full border-8 border-t-8 border-gray-200 ease-linear"></div>
        <Subheading className="mt-12 text-center">
          Calculating, please wait..
        </Subheading>
      </div>
    </div>
  );
}

export function LoaderWithLogo() {
  return (
    <div className="flex h-full items-center justify-center py-24 px-16">
      <div className="w-[175px] animate-pulse">
        <LogotypeIcon />
      </div>
    </div>
  );
}
