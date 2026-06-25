export const useExchangeStore = defineStore("exchange", () => {
  /* Provider */

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

  async function fetchRates() {
    try {
      const data = await $fetch<Rate[]>(`https://api.frankfurter.dev/v2/rates?providers=${provider.value}`);

      if (!data || data.length === 0) {
        console.error(`No rates found for ${base.value} with provider ${provider.value}`);
        // rates.value = [];
      }

      rates.value = data;
    }
    catch (error) {
      console.error("Fetch rates failed:", error);
    }
  }

  /* Rates the Day Prior (yesterday) */

  const ratesYesterday = ref<Rate[]>([]);

  async function fetchRatesYesterday() {
    try {
      const data = await $fetch<Rate[]>(`https://api.frankfurter.dev/v2/rates?date=${getYesterdaysDate()}providers=${provider.value}`);

      if (!data || data.length === 0) {
        console.error(`No rates found for ${base.value} with provider ${provider.value}`);
      }

      ratesYesterday.value = data;
    }
    catch (error) {
      console.error("Fetch rates for yesterday failed:", error);
    }
  }

  /* Rate actions */

  function rateRelativeToEur(quote: string, date: "today" | "yesterday" = "today"): number | undefined {
    if (quote === "EUR")
      return 1;

    if (date === "yesterday")
      return ratesYesterday.value.find(item => item.quote === quote)?.rate;

    return rates.value.find(item => item.quote === quote)?.rate;
  }

  function rateForPair(base: string, quote: string, date: "today" | "yesterday" = "today"): number | undefined {
    const rateOfEurToQuote = rateRelativeToEur(quote, date);
    if (rateOfEurToQuote === undefined)
      return undefined;
    if (base === "EUR")
      return rateOfEurToQuote;

    const rateOfEurToBase = rateRelativeToEur(base, date);
    if (rateOfEurToBase === undefined)
      return undefined;
    if (quote === "EUR")
      return Number((1 / rateOfEurToBase).toPrecision(5));

    return Number((rateOfEurToQuote / rateOfEurToBase).toPrecision(5));
  }

  /* Amount */

  const rate = computed<number | undefined>(() => {
    return rateForPair(base.value, quote.value);
  });

  /* Amount */

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

  const conversionLog = ref<Conversion[]>([]);

  function doesConversionLogExist(datetime: string | number | Date) {
    return conversionLog.value.some(log => log.datetime === datetime);
  }

  function addConversionLog(base: string, quote: string, rate: number | undefined, send: number | undefined, receive: number | "" | undefined) {
    if (rate === undefined || send === undefined || receive === "" || receive === undefined)
      return;

    // for testing purposes:
    // const datetime = "2026-06-18T10:10:00.000Z";
    const datetime = new Date().toISOString();

    if (doesConversionLogExist(datetime))
      return;
    conversionLog.value.unshift({ datetime, base, quote, rate, send, receive });
  }

  function deleteConversionLog(datetime: string | number | Date) {
    const index = conversionLog.value.findIndex(log => log.datetime === datetime);
    if (index === -1)
      return;
    conversionLog.value.splice(index, 1);
  }

  function deleteAllConversionLogs() {
    conversionLog.value.length = 0;
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
    fetchRates,
    ratesYesterday,
    fetchRatesYesterday,
    rateRelativeToEur,
    rateForPair,
    rate,
    amount,
    favorites,
    doesFavoriteExist,
    addFavorite,
    deleteFavorite,
    conversionLog,
    doesConversionLogExist,
    addConversionLog,
    deleteConversionLog,
    deleteAllConversionLogs,
  };
}, {
  persist: {
    storage: piniaPluginPersistedstate.cookies(),
    pick: [
      "provider",
      "base",
      "quote",
      "amount",
      "favorites",
      "conversionLog",
    ],
  },
});
