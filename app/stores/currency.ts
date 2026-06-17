export const useCurrencyStore = defineStore("currency", () => {
  const loading = ref(false);
  const provider = ref("ECB");

  const currencies = ref<Currency[]>([]);
  const numCurrencies = computed(() => currencies.value.length);
  async function fetchCurrencies() {
    try {
      const data = await $fetch<Currency[]>(`https://api.frankfurter.dev/v2/currencies?providers=${provider.value}`);

      if (!data || data.length === 0) {
        console.error(`No currencies found with provider ${provider.value}`);
        currencies.value = [];
        return;
      }

      currencies.value = data;
    }
    catch (error) {
      console.error("Fetch currencies failed:", error);
    }
  }

  const base = ref("USD");
  const quote = ref("EUR");
  function swap() {
    [base.value, quote.value] = [quote.value, base.value];
  }

  const rates = ref<Rate[]>([]);
  const numRates = computed(() => currencies.value.length);
  const rate = ref<number | undefined>();
  async function fetchRates() {
    try {
      const data = await $fetch<Rate[]>(`https://api.frankfurter.dev/v2/rates?base=${base.value}&providers=${provider.value}`);

      if (!data || data.length === 0) {
        console.error(`No rates found for ${base.value} with provider ${provider.value}`);
        rates.value = [];
        rate.value = undefined;
        return;
      }

      rates.value = data;
      const newRate = data.find(item => item.quote === quote.value);

      if (newRate) {
        rate.value = newRate.rate;
      }
      else {
        console.error(`Rate comparison (${base.value}/${quote.value}) not found with provider ${provider.value}`);
        rate.value = undefined;
      }
    }
    catch (error) {
      console.error("Fetch rates failed:", error);
    }
  }

  const amount = ref<number | undefined>();

  return {
    loading,
    provider,
    currencies,
    numCurrencies,
    fetchCurrencies,
    base,
    quote,
    swap,
    rates,
    numRates,
    rate,
    fetchRates,
    amount,
  };
});
