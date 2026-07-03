export const useExchangeStore = defineStore("exchange", () => {
  /* Dates (config) */

  const daysInPastToFetch = ref(5);
  const startDate = computed(() => getRelativeDate(daysInPastToFetch.value));

  /* Currency + Provider (config) */

  const provider = ref("ECB");
  const referenceCurrency = ref("EUR");

  /* Base/Quote Pair */

  const base = ref<CurrencyCode>("USD");
  const quote = ref<CurrencyCode>("EUR");

  function swap() {
    [base.value, quote.value] = [quote.value, base.value];
  }

  /* Rates as Time Series (today through 5 days ago) */

  const rates = ref<Rate[]>([]);

  async function fetchRates() {
    try {
      const data = await $fetch<Rate[]>(
        `https://api.frankfurter.dev/v2/rates?&providers=${provider.value}&base=${referenceCurrency.value}&from=${startDate.value}`,
      );

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

  /* Dates (derived) */

  const availableDates = computed<string[]>(() => rates.value ? [...new Set(rates.value.map(rate => rate.date))].sort((a, b) => a < b ? 1 : -1) : []);
  const latestDate = computed<string | undefined>(() => availableDates.value.length > 0 ? availableDates.value[0] : undefined);
  const previousDate = computed<string | undefined>(() => availableDates.value.length > 1 ? availableDates.value[1] : undefined);

  /* Currencies */

  // const availableCurrencies = computed<string[]>(() => rates.value ? [...new Set(rates.value.map(rate => rate.quote)), referenceCurrency.value].sort((a, b) => a < b ? -1 : 1) : []);
  const availableCurrencies = computed<string[]>(() => rates.value ? [...new Set(rates.value.map(rate => rate.quote))].sort((a, b) => a < b ? -1 : 1) : []);

  /* Rates (convenvience filters by date) */

  const latestRates = computed<Rate[]>(() => rates.value.filter(rate => rate.date === latestDate.value));
  const previousRates = computed<Rate[]>(() => rates.value.filter(rate => rate.date === previousDate.value));

  /* Rate actions */

  function rateRelativeToEur(quote: string, date: "latest" | "previous" = "latest"): number | undefined {
    if (quote === referenceCurrency.value)
      return 1;

    if (date === "previous")
      return rates.value.find(item => item.quote === quote && item.date === previousDate.value)?.rate;

    return rates.value.find(item => item.quote === quote && item.date === latestDate.value)?.rate;
  }

  function rateForPair(base: string, quote: string, date: "latest" | "previous" = "latest"): number | undefined {
    const rateOfEurToQuote = rateRelativeToEur(quote, date);
    if (rateOfEurToQuote === undefined)
      return undefined;
    if (base === referenceCurrency.value)
      return rateOfEurToQuote;

    const rateOfEurToBase = rateRelativeToEur(base, date);
    if (rateOfEurToBase === undefined)
      return undefined;
    if (quote === referenceCurrency.value)
      return Number((1 / rateOfEurToBase).toPrecision(5));

    return Number((rateOfEurToQuote / rateOfEurToBase).toPrecision(5));
  }

  /* Rate */

  const rate = computed<number | undefined>(() => {
    return rateForPair(base.value, quote.value);
  });

  /* Amount */

  const amount = ref<number | undefined>();

  /* Ticker */

  const tickerPairs = ref<Pair[]>([
    { base: "USD", quote: "JPY" },
    { base: "GBP", quote: "USD" },
    { base: "USD", quote: "CHF" },
    { base: "EUR", quote: "GBP" },
    { base: "AUD", quote: "USD" },
    { base: "USD", quote: "CAD" },
  ]);

  /* History */

  const activeTab = ref("history");

  /* History */

  const historyTimeScale = ref("1M");

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
    daysInPastToFetch,
    startDate,
    provider,
    referenceCurrency,
    base,
    quote,
    swap,
    rates,
    fetchRates,
    availableDates,
    latestDate,
    previousDate,
    availableCurrencies,
    latestRates,
    previousRates,
    rateRelativeToEur,
    rateForPair,
    rate,
    amount,
    tickerPairs,
    activeTab,
    historyTimeScale,
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
      "base",
      "quote",
      "amount",
      "activeTab",
      "historyTimeScale",
      "favorites",
      "conversionLog",
    ],
  },
});
