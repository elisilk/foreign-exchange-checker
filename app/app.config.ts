export default defineAppConfig({
  ui: {
    colors: {
      primary: "lime",
      neutral: "neutral",
    },
    card: {
      slots: {
        root: "p-4 sm:p-5 space-y-4 sm:space-y-5",
        header: (defaultClasses: string) => `${defaultClasses} uppercase grid gap-2.5 sm:flex sm:justify-between sm:items-center p-0 sm:p-0`,
        body: "p-0 sm:p-0",
        footer: "p-0 sm:p-0",
        title: "text-xl font-medium flex gap-3 items-center",
        description: "mt-0 text-sm flex gap-4 items-center justify-between",
      },
      variants: {
        variant: {
          outline: {
            root: "bg-neutral-700 divide-y-0",
          },
        },
      },
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
          sm: {
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
