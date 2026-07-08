<script setup lang="ts">
const exchange = useExchangeStore();

const compareRates = computed<Rate[]>(() => {
  // if EUR is base, then return the rates as they are
  // (no need for additional calculations or additions/removals)
  if (exchange.base === exchange.referenceCurrency)
    return exchange.latestRates;

  // otherwise
  //  - remove base from array
  //  - re-calculate array rates using the actual base currency
  //  - retrieve and add rate with EUR as quote to the array
  //  - sort
  //  - return the new array

  const transformedRates = exchange.latestRates
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

  // const rateEuroToBase = exchange.rateRelativeToEur(exchange.base);
  // const euroRate: Rate = {
  //   date: exchange.latestDate || "",
  //   base: exchange.base as string,
  //   quote: exchange.referenceCurrency,
  //   rate: rateEuroToBase ? Number((1 / rateEuroToBase).toPrecision(5)) : undefined,
  // };
  // transformedRates.push(euroRate);

  return transformedRates.sort((a, b) => a.quote > b.quote ? 1 : -1);
});
</script>

<template>
  <section class="compare-component" aria-label="Compare">
    <UEmpty
      v-if="!exchange.amount"
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
      :description="`${exchange.latestRates.length} pairs`"
    >
      <template #title>
        <span class="text-lg">Multi-currency</span>
        <span>{{ exchange.amount.toLocaleString('en-US', {
          maximumFractionDigits: 2,
        }) }} from {{ exchange.base }}</span>
      </template>

      <TransitionGroup
        name="list"
        tag="ul"
        class="space-y-4"
      >
        <SectionCompareItem
          v-for="rate in compareRates"
          :key="`compare-item-${exchange.amount}-${rate.base}-${rate.quote}`"
          :rate
        />
      </TransitionGroup>
    </UCard>
  </section>
</template>
