export default defineAppConfig({
  ui: {
    colors: {
      primary: "lime",
      neutral: "custom-gray",
      success: "green",
      error: "red",
    },
    header: {
      slots: {
        root: "border-none",
        container: "max-w-360 lg:px-6",
      },
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
        description: "mt-0 text-sm flex gap-4 items-center justify-between text-default",
      },
      variants: {
        variant: {
          outline: {
            root: "bg-muted divide-y-0 rounded-2xl p-4 md:p-5 space-y-4 md:space-y-5",
            header: "uppercase grid gap-2.5 md:flex md:justify-between md:items-center p-0 sm:p-0 md:p-0",
            body: "p-0 sm:p-0 md:p-0",
            footer: "p-0 sm:p-0 md:p-0",
          },
          subtle: {
            root: "bg-muted rounded-3xl border-0 ring-0 shadow-[0_12px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] divide-dashed divide-muted",
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
          class: "relative z-10 bg-elevated ring-primary hover:bg-accented focus-visible:ring-primary focus-visible:outline-offset-1",
        },
        {
          color: "neutral",
          variant: "subtle",
          class: "relative z-10 focus-visible:ring-neutral focus-visible:outline focus-visible:outline-primary focus-visible:outline-offset-1 font-normal",
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
        label: "text-lg text-default uppercase",
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
      slots: {
        base: ["w-26 h-10"],
        content: ["w-[min(376px,100vw-64px)] bg-elevated border border-accented shadow-[0_20px_60px_rgba(10,10,10,0.5)] dark:shadow-[0_20px_60px_rgba(10,10,10,0.5)] p-2"],
        trailingIcon: "text-highlighted",
        itemLabel: "text-highlighted",
        item: [
          "items-center data-highlighted:not-data-disabled:before:outline-1 data-highlighted:not-data-disabled:before:outline-primary",
        ],
        input: "rounded-xs border border-accented",
        group: "p-0",
        viewport: "pt-2.5",
        label: "uppercase",
      },
      variants: {
        size: {
          md: {
            base: "p-2.5 text-lg gap-1.5",
          },
        },
        variant: {
          outline: "bg-accented",
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
    marquee: {
      slots: {
        root: "items-stretch [--duration:40s]",
        content: "items-stretch",
      },
    },
    tabs: {
      slots: {
        trigger: ["cursor-pointer data-[state=inactive]:text-highlighted hover:data-[state=inactive]:not-disabled:text-default"],
        label: "uppercase",
        trailingBadge: "ring-0 inline-flex rounded-full bg-primary-200 dark:bg-primary-800 w-5 h-5 px-0 py-0 items-center justify-center text-xs text-primary",
      },
      compoundVariants: [{
        color: "primary",
        variant: "link",
        class: {
          trigger: [
            "data-[state=active]:text-highlighted",
          ],
        },
      }],
    },
    radioGroup: {
      slots: {
        fieldset: "inline-flex bg-muted gap-x-0 p-0.5 rounded-md",
        item: "group cursor-pointer items-center",
      },
      variants: {
        variant: {
          card: {
            item: "border-0 rounded-md",
          },
        },
      },
      compoundVariants: [
        {
          color: "neutral",
          variant: "card",
          class: {
            item: "has-data-[state=checked]:border-0 has-data-[state=checked]:bg-accented has-data-[state=checked]:text-highlighted hover:bg-elevated has-focus-visible:outline-2 has-focus-visible:outline-inverted",
            label: "group-has-data-[state=checked]:text-highlighted",
          },
        },
      ],
    },
  },
});
