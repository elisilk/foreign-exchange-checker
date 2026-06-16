export const useCurrencyStore = defineStore("currency", () => {
  const provider = ref("ECB");
  const base = ref("USD");
  const quote = ref("EUR");
  const amount = ref<number | undefined>();

  function swap() {
    [base.value, quote.value] = [quote.value, base.value];
  }

  return { provider, base, quote, amount, swap };
});
