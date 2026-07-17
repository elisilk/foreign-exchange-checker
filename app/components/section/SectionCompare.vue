<script setup lang="ts">
const exchange = useExchangeStore();

const compareRates = computed<SanitizedRate[]>(() => {
  // if EUR is base, then return the rates as they are
  // (no need for additional calculations or additions/removals)
  if (exchange.sendCurrency === exchange.referenceCurrency)
    return exchange.latestRates;

  // otherwise
  //  - remove base from array
  //  - re-calculate array rates using the actual base currency
  //  - retrieve and add rate with EUR as quote to the array
  //  - sort
  //  - return the new array
  const transformedRates = exchange.latestRates
    .filter(rate => rate.quote !== exchange.sendCurrency)
    .map(
      (rate) => {
        return ({
          date: rate.date,
          base: exchange.sendCurrency,
          quote: rate.quote,
          rate: exchange.getPairRateAsString(exchange.sendCurrency, rate.quote),
        });
      },
    )
    .sort((a, b) => a.quote > b.quote ? 1 : -1);

  return transformedRates;
});
</script>

<template>
  <section class="compare-component" aria-label="Compare">
    <UEmpty
      v-if="!exchange.sendAmount"
      title="No comparison available"
      description="Enter an amount in SEND above to see what your money is worth in other currencies."
    />

    <UEmpty
      v-else-if="!exchange.latestRates || exchange.latestRates.length === 0"
      title="No rates available"
      description="There was an issue getting the latest rates. Try to refresh the page or come back again later. Sorry!"
    />

    <UCard
      v-else
      :description="`${compareRates.length} pairs`"
    >
      <template #title>
        <span class="text-lg">Multi-currency</span>
        <span>{{ exchange.sendAmount }} from {{ exchange.sendCurrency }}</span>
      </template>

      <TransitionGroup
        name="list"
        tag="ul"
        class="space-y-4"
      >
        <SectionCompareItem
          v-for="rate in compareRates"
          :key="`compare-item-${exchange.sendAmount}-${rate.base}-${rate.quote}`"
          :rate
        />
      </TransitionGroup>
    </UCard>
  </section>
</template>
