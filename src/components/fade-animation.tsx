import { m } from "framer-motion";

const animation = {
  name: "Fade Back",
  variants: {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  },
  transition: {
    duration: 0.2,
  },
  delayed: {
    duration: 0.2,
    delay: 0.1,
  },
};

export const FadeAnimation = ({
  children,
  name,
  delayed,
}: {
  children: React.ReactNode;
  name?: string;
  delayed?: boolean;
}) => (
  <m.div
    key={name || animation.name}
    style={{
      height: "100%",
      width: "100%",
    }}
    initial="initial"
    animate="animate"
    exit="exit"
    variants={animation.variants}
    transition={delayed ? animation.delayed : animation.transition}
  >
    {children}
  </m.div>
);
