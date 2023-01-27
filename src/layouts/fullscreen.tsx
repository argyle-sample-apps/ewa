import { useResizeDetector } from "react-resize-detector";
import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";
import {
  LeftArrowIcon,
  LightIcon,
  EnableIcon,
  HistoryIcon,
  TuneIcon,
  BrandLogo,
} from "components/icons";
import { isStandaloneMode } from "utils";
import { getBasePath } from "utils";

type FullscreenProps = {
  children: React.ReactNode;
  back?: boolean;
  navigation?: boolean;
  bg?: string;
  logo?: boolean;
};

const getBgColor = (bg?: string) => {
  switch (bg) {
    case "yellow":
      return "bg-yellow-20";
    case "green":
      return "bg-green-20";
    case "red":
      return "bg-red-20";
    case "blue":
      return "bg-blue-20";
    case "gray":
      return "bg-gray-10";
    default:
      return "white";
  }
};

const BottomNavigation = ({ height }: { height: number }) => {
  const router = useRouter();
  const basePath = getBasePath(router.pathname);

  const links = [
    { id: 1, label: "Early Pay", url: "/early", icon: <LightIcon /> },
    { id: 2, label: "History", url: "/history", icon: <HistoryIcon /> },
    { id: 3, label: "Income", url: "/income", icon: <EnableIcon /> },
    { id: 4, label: "Settings", url: "/settings", icon: <TuneIcon /> },
  ];

  return (
    <div
      className="space-between flex w-full border-t border-gray-T08 py-2"
      style={{ height }}
    >
      {links.map((link) => (
        <Link key={link.id} href={link.url}>
          <a
            className={clsx(
              "flex flex-1 flex-col items-center text-xs text-black",
              basePath === getBasePath(link.url) ? "opacity-1" : "opacity-40"
            )}
          >
            <span className="mb-1 block h-6 w-6">{link.icon}</span>
            <span>{link.label}</span>
          </a>
        </Link>
      ))}
    </div>
  );
};

function Fullscreen({ children, back, navigation, bg, logo }: FullscreenProps) {
  const { height, ref } = useResizeDetector();
  const router = useRouter();
  const standalone = isStandaloneMode();

  const BOTTOM_NAV_HEIGHT = standalone ? 83 : 62;
  const BACK_BUTTON_HEIGHT = 52;
  const LOGO_HEIGHT = 44;

  const nonScrollableHeight = () => {
    switch (true) {
      case back:
        return BACK_BUTTON_HEIGHT;
      case logo && navigation:
        return BOTTOM_NAV_HEIGHT + LOGO_HEIGHT;
      case navigation:
        return BOTTOM_NAV_HEIGHT;
      case logo:
        return LOGO_HEIGHT;
      default:
        return 0;
    }
  };

  return (
    <div
      id="__container"
      className={clsx("h-full", bg ? getBgColor(bg) : "bg-white")}
      ref={ref}
    >
      {logo && (
        <div className="px-4 pt-5 pb-1">
          <BrandLogo />
        </div>
      )}
      {back && (
        <div className="px-4 pt-5">
          <button className="block h-8 w-8 p-1" onClick={() => router.back()}>
            <LeftArrowIcon />
          </button>
        </div>
      )}
      <main
        className="scrollbar overflow-auto"
        style={height ? { height: height - nonScrollableHeight() } : {}}
      >
        {children}
      </main>
      {navigation && <BottomNavigation height={BOTTOM_NAV_HEIGHT} />}
    </div>
  );
}

export default Fullscreen;
