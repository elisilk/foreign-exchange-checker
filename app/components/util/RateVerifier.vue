<script setup lang="ts">
const exchange = useExchangeStore();

const { data: dataFetched, status } = useLazyFetch<Rate[]>(
  () =>
    `https://api.frankfurter.dev/v2/rates?from=${exchange.startDate}&base=${exchange.base}&quotes=${exchange.quote}&providers=${exchange.provider}`,
  {
    server: false,
    transform: (rates) => {
      return [...rates].sort((a, b) => a.date > b.date ? -1 : 1);
    },
  },
);

// // Function to count the total number of rates for each date
// const dateCounts = computed(() => exchange.rates
//   ? exchange.rates.reduce<Record<string, number>>((accumulator, rate) => {
//       const key = rate.date;
//       accumulator[key] = (accumulator[key] || 0) + 1;
//       return accumulator;
//     }, {})
//   : {});

const dataCalculated = computed(() => [
  {
    date: exchange.latestDate,
    base: exchange.base,
    quote: exchange.quote,
    rate: exchange.rateForPair(exchange.base, exchange.quote, "latest"),
  },
  {
    date: exchange.previousDate,
    base: exchange.base,
    quote: exchange.quote,
    rate: exchange.rateForPair(exchange.base, exchange.quote, "previous"),
  },
]);
</script>

<template>
  <section aria-labelledby="rate-verifier-heading" class="space-y-4">
    <h2 id="rate-verifier-heading">
      Rate Verifier
    </h2>

    <UEmpty
      v-if="!exchange.rates || exchange.rates.length === 0"
      title="No rates available"
      description="There was an issue getting the latest rates. Try to refresh the page or come back again later. Sorry!"
    />

    <UCard v-else>
      <h3 class="mb-2">
        Calculated data
      </h3>
      <UTable :data="dataCalculated" class="flex-1" />

      <h3 class="mt-6 mb-2">
        Fetched data
        <span class="text-sm">({{ exchange.startDate }} - {{ exchange.latestDate }})</span>
      </h3>
      <p />
      <UTable
        :data="dataFetched"
        :loading="status === 'pending' || status === 'idle'"
        class="flex-1"
      />
    </UCard>
  </section>
</template>
