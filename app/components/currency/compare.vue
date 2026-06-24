<script setup lang="ts">
const exchange = useExchangeStore();

const compareRates = computed<Rate[]>(() => {
  // if EUR is base, then return the rates as they are
  // (no need for additional calculations or additions/removals)
  if (exchange.base === "EUR")
    return exchange.rates;

  // otherwise
  //  - remove base from array
  //  - re-calculate array rates using the actual base currency
  //  - retrieve and add rate with EUR as quote to the array
  //  - sort
  //  - return the new array

  const transformedRates = exchange.rates
    .filter(rate => rate.quote !== exchange.base)
    .map((rate) => {
      const rateForPair = exchange.rateForPair(exchange.base, rate.quote);
      return ({
        date: rate.date,
        base: exchange.base as string,
        quote: rate.quote as string,
        rate: rateForPair,
      });
    });

  const rateEuroToBase = exchange.rateRelativeToEur(exchange.base);
  const euroRate: Rate = {
    date: getTodayLocal(),
    base: exchange.base as string,
    quote: "EUR",
    rate: rateEuroToBase ? Number((1 / rateEuroToBase).toPrecision(5)) : undefined,
  };
  transformedRates.push(euroRate);

  return transformedRates.sort((a, b) => a.quote > b.quote ? 1 : -1);
});

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function getCurrencyName(isoCode: string): string | undefined {
  const currency = currencies.find(item => item.iso_code === isoCode);
  if (!currency)
    return undefined;
  return currency.name;
}

function getExchangeAmount(pair: Rate, amount: number): string {
  if (pair.rate === undefined)
    return "Error";
  return formatter.format(amount * pair.rate);
}

function handlePairClick(quote: string) {
  // console.log(`handling pair click: ${exchange.base}/${quote}`);
  exchange.quote = quote as CurrencyCode;
}
</script>

<template>
  <section class="compare-component" aria-label="Compare">
    <template v-if="!exchange.amount">
      <AppTabEmpty class="max-w-115">
        <template #heading>
          No comparison available
        </template>
        Enter an amount in <span>SEND</span> above to see what your money is worth in other currencies.
      </AppTabEmpty>
    </template>

    <template v-else-if="!exchange.rates || exchange.rates.length === 0">
      <AppTabEmpty class="max-w-115">
        <template #heading>
          No rates available
        </template>
        There was an issue getting the latest rates. Try to refresh the page or come back again later. Sorry!
      </AppTabEmpty>
    </template>

    <UCard
      v-else
      :description="`${exchange.rates.length} pairs`"
    >
      <template #title>
        <span class="text-lg text-neutral-200">Multi-currency</span>
        <span>{{ exchange.amount.toLocaleString('en-US', {
          maximumFractionDigits: 2,
        }) }} from {{ exchange.base }}</span>
      </template>
      <div class="space-y-4">
        <div
          v-for="pair in compareRates"
          :key="`compare-${pair.base}-${pair.quote}`"
          tabindex="0"
          role="group"
          :aria-label="`Comparison for pair: ${pair.base} to ${pair.quote}`"
          class="flex items-center gap-4 py-3 px-4 border border-neutral-500 rounded-lg bg-neutral-600 hover:cursor-pointer hover:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          @click="handlePairClick(pair.quote)"
          @keydown.enter="handlePairClick(pair.quote)"
          @keydown.space.prevent="handlePairClick(pair.quote)"
        >
          <UIcon
            :name="getFlagIcon(pair.quote as CurrencyCode)"
            class="flag size-6"
          />

          <div class="grid gap-1.5">
            <span class="text-lg text-neutral-50">{{ pair.quote }}</span>
            <span class="text-sm text-neutral-200">{{ getCurrencyName(pair.quote) }}</span>
          </div>

          <div class="ms-auto grid gap-1.5 justify-items-end">
            <span class="text-xl text-neutral-50">{{ getExchangeAmount(pair, exchange.amount) }}</span>
            <span class="text-xs text-neutral-200">@ {{ pair.rate }}</span>
          </div>

          <ButtonToggleFavorite :base="pair.base" :quote="pair.quote" />
        </div>
      </div>
    </UCard>
  </section>
</template>
