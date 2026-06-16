// stores/currency.ts
export const useCurrencyStore = defineStore("currency", () => {
  const provider = ref("ECB");
  const base = ref("USD");
  const quote = ref("EUR");

  return { provider, base, quote };
});
