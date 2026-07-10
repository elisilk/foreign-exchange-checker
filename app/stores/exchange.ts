export const useExchangeStore = defineStore(
  "exchange",
  () => {
    const actionTimeoutMs = 2000;

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

    const availableCurrencies = computed<string[]>(() => {
      if (!rates.value)
        return [];

      const uniqueCurrencies
        = [...new Set(rates.value.map(rate => rate.quote))];

      if (!uniqueCurrencies.includes(referenceCurrency.value))
        uniqueCurrencies.push(referenceCurrency.value);

      return uniqueCurrencies.sort((a, b) => a < b ? -1 : 1);
    });

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

    /* Amounts (send & receive) */

    const send = ref<number | undefined>();

    const isConversionValid = computed(() => rate.value !== undefined && Number.isFinite(rate.value) && send.value !== undefined && Number.isFinite(send.value));

    const receive = computed<number | undefined>(() => isConversionValid.value ? rate.value! * send.value! : undefined);

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

    const allowedTabs = new Set(["history", "compare", "favorites", "log"]);

    const allowedTabsArray = Array.from(allowedTabs);
    const numTabItems = allowedTabsArray.length;

    function cycleTabs(direction: "forward" | "backward" = "forward") {
      if (numTabItems === 0)
        return;

      const currentTabIndex = allowedTabsArray.findIndex(item => item === activeTab.value);

      let nextTabIndex = currentTabIndex + (direction === "forward" ? 1 : -1);

      if (nextTabIndex >= numTabItems)
        nextTabIndex = nextTabIndex % numTabItems;

      if (nextTabIndex < 0)
        nextTabIndex = numTabItems - 1;

      activeTab.value = allowedTabsArray[nextTabIndex] || "";
    }

    /* History */

    const historyTimeScale = ref("1M");

    const allowedTimeScales = new Set(["1D", "1W", "1M", "3M", "1Y", "5Y"]);

    const allowedTimeScalesArray = Array.from(allowedTimeScales);
    const numTimeScaleItems = allowedTimeScalesArray.length;

    function cycleHistoryTimeScale(direction: "forward" | "backward" = "forward") {
      if (numTimeScaleItems === 0)
        return;

      const currentTimeScaleIndex = allowedTimeScalesArray.findIndex(item => item === historyTimeScale.value);

      let nextTimeScaleIndex = currentTimeScaleIndex + (direction === "forward" ? 1 : -1);

      if (nextTimeScaleIndex >= numTimeScaleItems)
        nextTimeScaleIndex = nextTimeScaleIndex % numTimeScaleItems;

      if (nextTimeScaleIndex < 0)
        nextTimeScaleIndex = numTimeScaleItems - 1;

      historyTimeScale.value = allowedTimeScalesArray[nextTimeScaleIndex] || "";
    }

    /* Favorites */

    const favorites = ref<Pair[]>([]);

    function doesFavoriteExist(baseCurrency: string, quoteCurrency: string) {
      return favorites.value.some(favorite => favorite.base === baseCurrency && favorite.quote === quoteCurrency);
    }

    function addFavorite(baseCurrency: string, quoteCurrency: string) {
      if (doesFavoriteExist(baseCurrency, quoteCurrency))
        return;
      favorites.value.push({
        base: baseCurrency,
        quote: quoteCurrency,
      });
    }

    function deleteFavorite(baseCurrency: string, quoteCurrency: string) {
      const index = favorites.value.findIndex(favorite => favorite.base === baseCurrency && favorite.quote === quoteCurrency);
      if (index === -1)
        return;
      favorites.value.splice(index, 1);
    }

    function toggleFavorite(baseCurrency: string = base.value, quoteCurrency: string = quote.value) {
      if (doesFavoriteExist(baseCurrency, quoteCurrency)) {
        deleteFavorite(baseCurrency, quoteCurrency);
      }
      else {
        addFavorite(baseCurrency, quoteCurrency);
      }
    }

    /* Conversion Log */

    const conversionLog = ref<Conversion[]>([]);

    function doesConversionLogExist(datetime: string | number | Date) {
      return conversionLog.value.some(log => log.datetime === datetime);
    }

    function addConversionLog(base: string, quote: string, rate: number | undefined, send: number | undefined, receive: number | "" | undefined) {
      if (rate === undefined || send === undefined || receive === "" || receive === undefined)
        return;

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

    const isCurrentConversionLogging = ref(false);
    let currentConversionLoggingTimeout: ReturnType<typeof setTimeout> | null = null;

    function logCurrentConversion() {
      if (isCurrentConversionLogging.value
        || currentConversionLoggingTimeout
        || receive.value === undefined) {
        return;
      }

      isCurrentConversionLogging.value = true;

      addConversionLog(
        base.value,
        quote.value,
        rate.value,
        send.value,
        receive.value,
      );

      if (currentConversionLoggingTimeout)
        clearTimeout(currentConversionLoggingTimeout);

      currentConversionLoggingTimeout = setTimeout(
        () => {
          isCurrentConversionLogging.value = false;
          currentConversionLoggingTimeout = null;
        },
        actionTimeoutMs,
      );
    }

    /* Input Fields */

    const sendInputRef = ref<HTMLInputElement | null>(null);
    const receiveInputRef = ref<HTMLInputElement | null>(null);

    function registerSendInput(element: HTMLInputElement) {
      sendInputRef.value = markRaw(element);
    }

    function registerReceiveInput(element: HTMLInputElement) {
      receiveInputRef.value = markRaw(element);
    }

    function focusSendInput() {
      if (sendInputRef.value) {
        sendInputRef.value.focus();
      }
    }

    function focusReceiveInput() {
      if (receiveInputRef.value) {
        receiveInputRef.value.focus();
      }
    }

    /* URL hash state  */

    const activeUrlParams = ref<Set<string>>(new Set());

    function normalizeAmountValue(amount: number, currency: string): number {
      const zeroDecimalCurrencies = new Set(["JPY", "KRW", "ISK", "HUF", "IDR"]);

      if (zeroDecimalCurrencies.has(currency)) {
        return Math.round(amount);
      }

      return Number.parseFloat(amount.toFixed(2));
    }

    function formatAmountForUrl(amount: number, currency: string): string {
      const zeroDecimalCurrencies = new Set(["JPY", "KRW", "ISK", "HUF", "IDR"]);

      if (zeroDecimalCurrencies.has(currency)) {
        return Math.round(amount).toString();
      }

      return amount.toFixed(2);
    }

    function syncFromHash() {
      if (!import.meta.client)
        return;

      const { $router } = useNuxtApp();
      const hashString = $router.currentRoute.value.hash.replace("#", "");

      activeUrlParams.value.clear();

      if (hashString) {
        const params = new URLSearchParams(hashString);

        for (const key of params.keys()) {
          activeUrlParams.value.add(key.toLowerCase());
        }

        /* sync base currency */
        const baseParam = params.get("base")?.toUpperCase();
        if (baseParam && baseParam.length === 3 && availableCurrencies.value.includes(baseParam))
          base.value = baseParam;

        /* sync quote currency */
        const quoteParam = params.get("quote")?.toUpperCase();
        if (quoteParam && quoteParam.length === 3 && availableCurrencies.value.includes(quoteParam))
          quote.value = quoteParam;

        /* sync send amount */
        const sendParam = params.get("send");
        if (sendParam) {
          const parsedSend = Number.parseFloat(sendParam);
          // Ensure it is a valid number and greater than zero
          if (!Number.isNaN(parsedSend) && parsedSend > 0)
            send.value = normalizeAmountValue(parsedSend, base.value);
        }

        /* sync active tab */
        const tabParam = params.get("tab")?.toLowerCase();
        if (tabParam && allowedTabs.has(tabParam))
          activeTab.value = tabParam;

        /* sync history time scale */
        const timeScaleParam = params.get("time")?.toUpperCase();
        if (timeScaleParam && allowedTimeScales.has(timeScaleParam))
          historyTimeScale.value = timeScaleParam;
      }
    }

    if (import.meta.client) {
      watch(
        [base, quote, send, activeTab, historyTimeScale],
        ([newBase, newQuote, newSend, newActiveTab, newHistoryTimeScale]) => {
          const params = new URLSearchParams();

          if (activeUrlParams.value.has("base")) {
            params.set("base", newBase);
          }
          if (activeUrlParams.value.has("quote")) {
            params.set("quote", newQuote);
          }
          if (activeUrlParams.value.has("send") && newSend !== undefined && newSend !== null && !Number.isNaN(newSend)) {
            params.set("amount", formatAmountForUrl(newSend, newBase));
          }
          if (activeUrlParams.value.has("tab")) {
            params.set("tab", newActiveTab);
          }
          if (activeUrlParams.value.has("time")) {
            params.set("time", newHistoryTimeScale);
          }

          const newHash = params.toString() ? `#${params.toString()}` : "";

          navigateTo(
            { hash: newHash },
            { replace: true },
          );
        },
        { immediate: false },
      );
    }

    /* Share Links */

    function generateShareLink(): string {
      if (!import.meta.client)
        return "";

      const baseUrl = window.location.origin + window.location.pathname;
      const params = new URLSearchParams();

      params.set("base", base.value);
      params.set("quote", quote.value);

      if (send.value !== undefined && send.value !== null && !Number.isNaN(send.value)) {
        params.set("send", formatAmountForUrl(send.value, base.value));
      }

      params.set("tab", activeTab.value);

      if (activeTab.value === "history") {
        params.set("time", historyTimeScale.value);
      }

      return `${baseUrl}#${params.toString()}`;
    }

    const isShareLinkCopied = ref(false);
    let shareLinkCopyTimeout: ReturnType<typeof setTimeout> | null = null;

    async function copyShareLink() {
      if (!import.meta.client)
        return;

      const fullShareUrl = generateShareLink();

      try {
        await navigator.clipboard.writeText(fullShareUrl);
        isShareLinkCopied.value = true;

        if (shareLinkCopyTimeout)
          clearTimeout(shareLinkCopyTimeout);

        shareLinkCopyTimeout = setTimeout(
          () => {
            isShareLinkCopied.value = false;
          },
          actionTimeoutMs,
        );
      }
      catch (err) {
        console.error("Failed to copy share link: ", err);
      }
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
      send,
      isConversionValid,
      receive,
      tickerPairs,
      activeTab,
      cycleTabs,
      historyTimeScale,
      cycleHistoryTimeScale,
      favorites,
      doesFavoriteExist,
      addFavorite,
      deleteFavorite,
      toggleFavorite,
      conversionLog,
      doesConversionLogExist,
      addConversionLog,
      deleteConversionLog,
      deleteAllConversionLogs,
      isCurrentConversionLogging,
      logCurrentConversion,
      sendInputRef,
      receiveInputRef,
      registerSendInput,
      registerReceiveInput,
      focusSendInput,
      focusReceiveInput,
      syncFromHash,
      isShareLinkCopied,
      generateShareLink,
      copyShareLink,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.cookies(),
      pick: [
        "base",
        "quote",
        "send",
        "activeTab",
        "historyTimeScale",
        "favorites",
        "conversionLog",
      ],
    },
  },
);
