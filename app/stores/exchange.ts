export const useExchangeStore = defineStore("exchange", () => {
  /* Provivder */

  const provider = ref("ECB");

  /* Currencies */

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

  /* Base/Quote Pair */

  const base = ref<CurrencyCode>("USD");
  const quote = ref<CurrencyCode>("EUR");
  function swap() {
    [base.value, quote.value] = [quote.value, base.value];
  }

  /* Rates */

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

  /* Favorites */

  const favorites = ref<Pair[]>([]);

  function doesFavoriteExist(base: string, quote: string) {
    return favorites.value.some(favorite => favorite.base === base && favorite.quote === quote);
  }

  function addFavorite(base: string, quote: string) {
    if (doesFavoriteExist(base, quote))
      return;
    favorites.value.push({ base, quote });
  }

  function deleteFavorite(base: string, quote: string) {
    const index = favorites.value.findIndex(favorite => favorite.base === base && favorite.quote === quote);
    if (index === -1)
      return;
    favorites.value.splice(index, 1);
  }

  /* Conversion Log */

  const conversionLog = ref<Conversion[]>(
    [
      { timestamp: 1781813332304, base: "USD", quote: "EUR", rate: 0.87252, send: 1000, receive: 872.52 },
    ],
  );

  function doesConversionLogExist(timestamp: number) {
    return conversionLog.value.some(log => log.timestamp === timestamp);
  }

  function addConversionLog(base: string, quote: string, rate: number | undefined, send: number | undefined, receive: number | undefined) {
    if (rate === undefined || send === undefined || receive === undefined)
      return;
    const timestamp = Date.now();
    if (doesConversionLogExist(timestamp))
      return;
    conversionLog.value.push({ timestamp, base, quote, rate, send, receive });
  }

  function deleteConversionLog(timestamp: number) {
    const index = conversionLog.value.findIndex(log => log.timestamp === timestamp);
    if (index === -1)
      return;
    conversionLog.value.splice(index, 1);
  }

  return {
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
    favorites,
    doesFavoriteExist,
    addFavorite,
    deleteFavorite,
    conversionLog,
    doesConversionLogExist,
    addConversionLog,
    deleteConversionLog,
  };
});
