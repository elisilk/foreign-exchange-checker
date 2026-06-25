<script setup lang="ts">
const exchange = useExchangeStore();

const { data: dataFetched, status } = useLazyFetch<Rate[]>(
  () =>
    `https://api.frankfurter.dev/v2/rates?from=${exchange.dateYesterday}&base=${exchange.base}&quotes=${exchange.quote}&providers=${exchange.provider}`,
  {
    server: false,
  },
);

const dataCalculated = computed(() => [
  {
    date: exchange.dateToday,
    base: exchange.base,
    quote: exchange.quote,
    rate: exchange.rateForPair(exchange.base, exchange.quote, "today"),
  },
  {
    date: exchange.dateYesterday,
    base: exchange.base,
    quote: exchange.quote,
    rate: exchange.rateForPair(exchange.base, exchange.quote, "yesterday"),
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
      <h3>Calculated data</h3>
      <UTable :data="dataCalculated" class="flex-1" />

      <h3>Fetched data</h3>
      <UTable
        :data="dataFetched"
        :loading="status === 'pending' || status === 'idle'"
        class="flex-1"
      />
    </UCard>
  </section>
</template>
