export default defineAppConfig({
  ui: {
    colors: {
      primary: "lime",
      neutral: "neutral",
    },
    empty: {
      slots: {
        root: "py-10 sm:py-10 lg:py-10",
        header: "gap-4 max-w-2xl",
      },
      variants: {
        size: {
          md: {
            title: "text-3xl",
            description: "text-lg",
          },
        },
      },
      defaultVariants: {
        variant: "naked",
        size: "md",
      },
    },
    card: {
      slots: {
        header: "p-4 md:p-5",
        body: "p-4 md:p-5",
        footer: "p-4 md:p-5",
        title: (defaultClasses: string) => `${defaultClasses} text-xl font-medium flex gap-3 items-center`,
        description: "mt-0 text-sm flex gap-4 items-center justify-between",
      },
      variants: {
        variant: {
          outline: {
            root: "bg-neutral-700 divide-y-0 border-neutral-600 rounded-2xl p-4 md:p-5 space-y-4 md:space-y-5",
            header: "uppercase grid gap-2.5 md:flex md:justify-between md:items-center p-0 sm:p-0 md:p-0",
            body: "p-0 sm:p-0 md:p-0",
            footer: "p-0 sm:p-0 md:p-0",
          },
          subtle: {
            root: "bg-neutral-700 rounded-3xl border-0 ring-0 shadow-[0_12px_40px_rgba(0,0,0,0.4)] divide-dashed divide-neutral-500",
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
          class: "relative z-10 bg-neutral-600 ring-primary hover:bg-neutral-500 focus-visible:ring-primary focus-visible:outline-offset-1",
        },
        {
          color: "neutral",
          variant: "subtle",
          class: "relative z-10 focus-visible:ring-neutral focus-visible:outline focus-visible:outline-primary focus-visible:outline-offset-1 font-normal text-neutral-200",
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
    formField: {
      slots: {
        label: "text-lg text-neutral-100 uppercase",
      },
      variants: {
        orientation: {
          vertical: {
            container: "mt-5",
          },
        },
      },
    },
    input: {
      variants: {
        size: {
          xl: {
            base: "px-0 py-0 text-5xl field-sizing-content max-w-full min-w-4",
          },
        },
      },
      compoundVariants: [
        {
          color: "primary",
          variant: [
            "ghost",
          ],
          class: "text-primary selection:bg-primary/25 outline-primary focus-visible:outline-3 focus-visible:ring-primary",
        },
        {
          color: "neutral",
          variant: [
            "ghost",
          ],
          class: "selection:bg-primary/25 outline-primary focus-visible:outline-3 focus-visible:ring-primary",
        },
        {
          fixed: false,
          size: "xl",
          class: "md:text-5xl lg:text-6xl",
        },
      ],
    },
    selectMenu: {
      variants: {
        size: {
          md: {
            base: "p-2.5 text-lg gap-1.5",
          },
        },
        variant: {
          outline: "bg-neutral-500",
        },
      },
      compoundVariants: [
        {
          fixed: false,
          size: "md",
          class: "md:text-lg",
        },
      ],
    },
  },
});
