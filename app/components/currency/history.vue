<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <section aria-label="History">
    <template v-if="!exchange.amount">
      <h3>No chart data available</h3>
      <p>We couldn't load rate history for [pair] right now. This usually clears up in a minute.</p>
    </template>

    <UCard v-else title="History" />
  </section>
</template>
