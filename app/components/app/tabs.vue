<script setup lang="ts">
const exchange = useExchangeStore();

const items = computed(() => [
  {
    slot: "history",
    label: "History",
  },
  {
    slot: "compare",
    label: "Compare",
  },
  {
    slot: "favorites",
    label: "Favorites",
    count: exchange.favorites.length,
  },
  {
    slot: "log",
    label: "Log",
    count: exchange.conversionLog.length,
  },
]);
</script>

<template>
  <UTabs :items variant="link">
    <template #default="{ item }">
      <div class="flex items-center gap-2">
        <span>{{ item.label }}</span>
        <span v-if="item.count" class="rounded-full bg-primary-500 px-2 py-0.5 text-xs text-white font-bold">
          {{ item.count }}
        </span>
      </div>
    </template>

    <template #history>
      <CurrencyHistory />
    </template>

    <template #favorites>
      <CurrencyFavorites />
    </template>

    <template #log>
      <CurrencyLog />
    </template>

    <template #compare>
      <CurrencyCompare />
    </template>
  </UTabs>
</template>
