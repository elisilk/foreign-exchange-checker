/* eslint-disable ts/consistent-type-definitions */
import Big from "big.js";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      big: (value: string | number | Big) => new Big(value),
    },
  };
});

// Fixes the "Shorthand method signature is forbidden" error
declare module "#app" {
  interface NuxtApp {
    $big: (value: string | number | Big) => Big;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $big: (value: string | number | Big) => Big;
  }
}
