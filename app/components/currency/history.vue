<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <section aria-label="History">
    <UEmpty
      v-if="!exchange.amount"
      title="No chart data available"
    >
      <template #description>
        We couldn't load rate history for {{ exchange.base }}/{{ exchange.quote }} right now. This usually clears up in a minute.
      </template>
    </UEmpty>

    <UCard
      v-else
      title="History"
    />
  </section>
</template>
