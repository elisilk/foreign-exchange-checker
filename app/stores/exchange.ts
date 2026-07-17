import Big from "big.js";

export const useExchangeStore = defineStore(
  "exchange",
  () => {
    /* Timeout (config) */

    const actionTimeoutMs = 2000;

    /* Currency + Provider (config) */

    const locale = ref("en-US");
    const provider = ref("ECB");
    const referenceCurrency = ref<CurrencyCode>("EUR");

    /* Dates (config) */

    const daysInPastToFetch = 5;
    const startDate = computed(() => getRelativeDate(daysInPastToFetch));

    /* Rates as Time Series (today through 5 days ago) */

    const rates = ref<SanitizedRate[]>([]);
    const isLoadingRates = ref(false);

    async function fetchRates() {
      isLoadingRates.value = true;

      try {
        const response = await $fetch<ApiResponseRate[]>(
          `https://api.frankfurter.dev/v2/rates?&providers=${provider.value}&base=${referenceCurrency.value}&from=${startDate.value}`,
        );

        if (!response || response.length === 0) {
          console.error(`No rates found for ${referenceCurrency.value} with provider ${provider.value}`);
        }

        rates.value = response.map(
          rate => ({
            date: rate.date,
            base: rate.base,
            quote: rate.quote,
            rate: rate.rate.toString(),
          }),
        );
      }
      catch (error) {
        console.error("Fetch rates failed:", error);
      }
      finally {
        triggerExchangeCalculation();
        isLoadingRates.value = false;
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

    /* Currencies (send & receive) */

    const sendCurrency = ref<CurrencyCode>("USD");
    const receiveCurrency = ref<CurrencyCode>("EUR");

    /* Rates (convenvience filters by date) */

    const latestRates = computed<SanitizedRate[]>(() => rates.value.filter(rate => rate.date === latestDate.value));

    const previousRates = computed<SanitizedRate[]>(() => rates.value.filter(rate => rate.date === previousDate.value));

    /* Rate actions */

    function getRateRelativeToReference(quote: string, date: "latest" | "previous" = "latest"): Big {
      if (quote === referenceCurrency.value)
        return new Big(1);

      let relativeRate;

      if (date === "previous") {
        relativeRate = previousRates.value.find(item => item.quote === quote);
      }
      else {
        relativeRate = latestRates.value.find(item => item.quote === quote);
      }

      if (!relativeRate)
        return new Big(1);

      return new Big(relativeRate.rate);
    }

    function getPairRate(base: string, quote: string, date: "latest" | "previous" = "latest"): Big {
      return getRateRelativeToReference(quote, date)
        .div(getRateRelativeToReference(base, date));
    }

    function getPairRateAsString(base: string, quote: string, date: "latest" | "previous" = "latest"): string {
      return formatExchangeRate(getPairRate(base, quote, date));
    }

    function getPairRatePercentChange(base: string, quote: string) {
      const latest = new Big(getPairRate(base, quote));
      const previous = new Big(getPairRate(base, quote, "previous"));

      const delta = latest.minus(previous);
      const change = delta.div(previous).times(100);
      const isPositive = change.gte(0);

      const formattedPercent = `${(isPositive ? "+" : "") + change.toFixed(2)}%`;

      return {
        percentChange: formattedPercent,
        isPositive,
      };
    }

    /* Rate (for the current send/receive pair) */

    const rate = computed(() => {
      return getPairRate(sendCurrency.value, receiveCurrency.value);
    });

    /* Amounts (send & receive) */

    const sendAmount = ref("1000");
    const receiveAmount = ref("");

    const lastModified = ref<"send" | "receive">("send");

    function calculateExchangeAmount(rate: string | Big, sendAmount: string, receiveCurrency: CurrencyCode): string {
      const sendAmountClean = new Big(sanitizeNumericString(sendAmount));

      const rateClean = typeof rate === "string" ? new Big(sanitizeNumericString(rate)) : rate;

      const calculated = sendAmountClean.times(rateClean);

      return formatCurrency(calculated.toFixed(getCurrencyPrecision(receiveCurrency, locale.value)), receiveCurrency, locale.value);
    }

    function triggerExchangeCalculation() {
      if (rates.value.length === 0)
        return;

      try {
        if (lastModified.value === "send") {
          if (sendAmount.value === undefined || sendAmount.value === "") {
            receiveAmount.value = "";
            return;
          }

          if (Number.isNaN(Number(sendAmount.value)))
            return;

          const cleanSend = sanitizeNumericString(sendAmount.value);

          const sendBig = new Big(cleanSend);
          const calculated = sendBig.times(rate.value);

          receiveAmount.value = calculated.toFixed(getCurrencyPrecision(receiveCurrency.value, locale.value));
        }
        else {
          if (receiveAmount.value === undefined || receiveAmount.value === "") {
            sendAmount.value = "";
            return;
          }

          if (Number.isNaN(Number(receiveAmount.value)))
            return;

          const cleanReceive = sanitizeNumericString(receiveAmount.value);

          const receiveBig = new Big(cleanReceive);
          const calculated = receiveBig.div(rate.value);

          sendAmount.value = calculated.toFixed(getCurrencyPrecision(sendCurrency.value, locale.value));
        }
      }
      catch (error) {
        console.warn("Calculation error handled gracefully", error);
      }
    }

    watch(
      [sendCurrency, receiveCurrency],
      () => {
        triggerExchangeCalculation();
      },
    );

    function setSendAmount(val: string) {
      sendAmount.value = val;
      lastModified.value = "send";
      triggerExchangeCalculation();
    }

    function setReceiveAmount(val: string) {
      receiveAmount.value = val;
      lastModified.value = "receive";
      triggerExchangeCalculation();
    }

    /* Swap Currencies */

    function swapCurrencies() {
      const tempCurrency = sendCurrency.value;
      sendCurrency.value = receiveCurrency.value;
      receiveCurrency.value = tempCurrency;
      triggerExchangeCalculation();
    }

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

    function toggleFavorite(baseCurrency: string = sendCurrency.value, quoteCurrency: string = receiveCurrency.value) {
      if (doesFavoriteExist(baseCurrency, quoteCurrency)) {
        deleteFavorite(baseCurrency, quoteCurrency);
      }
      else {
        addFavorite(baseCurrency, quoteCurrency);
      }
    }

    /* Conversion Log */

    const conversionLog = ref<Conversion[]>([]);

    const isConversionValid = computed(() =>
      sendAmount.value && !Number.isNaN(Number(sendAmount.value)) && receiveAmount.value && !Number.isNaN(Number(receiveAmount.value)));

    function doesConversionLogExist(datetime: string | number | Date) {
      return conversionLog.value.some(log => log.datetime === datetime);
    }

    function addConversionLog(sendCurrency: string, receiveCurrency: string, sendAmount: string, receiveAmount: string, exchangeRate: string) {
      const datetime = new Date().toISOString();

      if (doesConversionLogExist(datetime))
        return;

      conversionLog.value.unshift(
        {
          id: crypto.randomUUID(),
          datetime,
          sendCurrency,
          receiveCurrency,
          sendAmount,
          receiveAmount,
          exchangeRate,
        },
      );
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
      if (isCurrentConversionLogging.value || currentConversionLoggingTimeout)
        return;

      isCurrentConversionLogging.value = true;

      addConversionLog(
        sendCurrency.value,
        receiveCurrency.value,
        sendAmount.value,
        receiveAmount.value,
        formatExchangeRate(rate.value),
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

    const csvHeaders: (keyof Conversion)[] = [
      "datetime",
      "sendCurrency",
      "sendAmount",
      "receiveCurrency",
      "receiveAmount",
      "exchangeRate",
    ];

    function downloadConversionLog() {
      if (conversionLog.value.length === 0)
        return;

      const headerRow = csvHeaders.join(",");

      const rows = conversionLog.value.map(row =>
        csvHeaders
          .map((key) => {
            const val = row[key];

            if (val instanceof Date) {
              return `"${val.toISOString()}"`;
            }

            if (typeof val === "string") {
              return `"${val.replace(/"/g, "\"\"")}"`;
            }

            return val;
          })
          .join(","),
      );

      const csvContent = [headerRow, ...rows].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "exported-data.csv");
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up memory
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
      if (!sendInputRef.value)
        return;

      if (document.activeElement === sendInputRef.value) {
        sendInputRef.value.blur();
      }
      else {
        sendInputRef.value.focus();
      }
    }

    function focusReceiveInput() {
      if (!receiveInputRef.value)
        return;

      if (document.activeElement === receiveInputRef.value) {
        receiveInputRef.value.blur();
      }
      else {
        receiveInputRef.value.focus();
      }
    }

    /* URL hash state  */

    const activeUrlParams = ref<Set<string>>(new Set());

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

        /* sync send (base) currency */
        const fromParam = params.get("from")?.toUpperCase();
        if (fromParam && fromParam.length === 3 && availableCurrencies.value.includes(fromParam))
          sendCurrency.value = fromParam;

        /* sync receive (quote) currency */
        const toParam = params.get("to")?.toUpperCase();
        if (toParam && toParam.length === 3 && availableCurrencies.value.includes(toParam))
          receiveCurrency.value = toParam;

        /* sync send amount */
        const amountParam = params.get("amount");
        if (amountParam) {
          const validNumericRegex = /^(?:\d+(?:\.\d+)?|\.\d+)$/;

          if (!validNumericRegex.test(amountParam)) {
            console.warn("Malformed amount in URL hash. Ignoring parameter.");
          }
          else {
            try {
              const testBig = new Big(amountParam);
              if (testBig.lte(0)) {
                console.warn("Amount from URL must be greater than zero.");
              }
              else {
                setSendAmount(amountParam);
              }
            }
            catch (error) {
              console.error("Big.js parsing failed on verified string", error);
            }
          }
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
        [sendCurrency, receiveCurrency, sendAmount, activeTab, historyTimeScale],
        ([newSendCurrency, newReceiveCurrency, newSendAmount, newActiveTab, newHistoryTimeScale]) => {
          const params = new URLSearchParams();

          if (activeUrlParams.value.has("from")) {
            params.set("from", newSendCurrency);
          }
          if (activeUrlParams.value.has("to")) {
            params.set("to", newReceiveCurrency);
          }
          if (activeUrlParams.value.has("amount")) {
            params.set("amount", newSendAmount);
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

      params.set("from", sendCurrency.value);
      params.set("to", receiveCurrency.value);

      if (sendAmount.value !== undefined && sendAmount.value !== null) {
        params.set("amount", sendAmount.value);
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
      locale,
      provider,
      referenceCurrency,
      startDate,

      rates,
      isLoadingRates,
      fetchRates,

      availableDates,
      latestDate,
      previousDate,

      availableCurrencies,
      sendCurrency,
      receiveCurrency,

      latestRates,
      previousRates,
      getRateRelativeToReference,
      getPairRate,
      getPairRateAsString,
      getPairRatePercentChange,
      rate,

      sendAmount,
      receiveAmount,
      calculateExchangeAmount,
      setSendAmount,
      setReceiveAmount,
      swapCurrencies,

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
      isConversionValid,
      doesConversionLogExist,
      addConversionLog,
      deleteConversionLog,
      deleteAllConversionLogs,
      isCurrentConversionLogging,
      logCurrentConversion,
      downloadConversionLog,

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
        "sendCurrency",
        "receiveCurrency",
        "sendAmount",
        "receiveAmount",
        "activeTab",
        "historyTimeScale",
        "favorites",
        "conversionLog",
      ],
    },
  },
);
