// stores/currency.ts
export const useCurrencyStore = defineStore("currency", () => {
  const provider = ref("ECB");
  const base = ref("USD");
  const quote = ref("EUR");
  const amount = ref<number | undefined>();

  return { provider, base, quote, amount };
});
