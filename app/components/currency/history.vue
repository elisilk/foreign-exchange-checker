<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <section aria-label="History">
    <template v-if="!exchange.amount">
      <AppTabEmpty class="max-w-127">
        <template #heading>
          No chart data available
        </template>
        We couldn't load rate history for {{ exchange.base }}/{{ exchange.quote }} right now. This usually clears up in a minute.
      </AppTabEmpty>
    </template>

    <UCard v-else title="History" />
  </section>
</template>
