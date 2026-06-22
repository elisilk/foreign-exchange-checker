export default defineAppConfig({
  ui: {
    colors: {
      primary: "lime",
      neutral: "neutral",
    },
    button: {
      slots: {
        base: ["cursor-pointer uppercase justify-center"],
      },
      variants: {
        size: {
          md: {
            leadingIcon: "size-3",
          },
        },
      },
      compoundVariants: [
        {
          color: "primary",
          variant: "outline",
          class: "ring-primary hover:bg-neutral-500 focus-visible:ring-primary focus-visible:outline-offset-1",
        },
        {
          color: "neutral",
          variant: "subtle",
          class: "focus-visible:ring-neutral focus-visible:outline focus-visible:outline-primary focus-visible:outline-offset-1 font-normal text-neutral-200",
        },
        {
          size: "sm",
          square: true,
          class: "h-8 w-8",
        },
        {
          size: "md",
          square: true,
          class: "h-12 w-12",
        },
      ],
    },
  },
});
