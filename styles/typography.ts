import { cva } from "class-variance-authority";

export const headingVariants = cva("font-heading tracking-tight text-foreground", {
  variants: {
    level: {
      h1: "text-4xl font-bold sm:text-5xl lg:text-6xl",
      h2: "text-3xl font-semibold sm:text-4xl",
      h3: "text-2xl font-semibold sm:text-3xl",
      h4: "text-xl font-semibold",
      h5: "text-lg font-medium",
      h6: "text-base font-medium",
    },
  },
  defaultVariants: {
    level: "h1",
  },
});

export const textVariants = cva("text-foreground", {
  variants: {
    variant: {
      body: "text-base leading-7",
      lead: "text-lg leading-8 text-muted-foreground",
      muted: "text-sm text-muted-foreground",
      small: "text-xs text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});
