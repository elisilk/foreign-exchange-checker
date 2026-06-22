<script setup lang="ts">
const exchange = useExchangeStore();

const items = computed(() => [
  {
    slot: "log",
    label: "Log",
    count: exchange.conversionLog.length,
  },
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
]);
</script>

<template>
  <UTabs
    :items
    variant="link"
  >
    <template #default="{ item }">
      <div class="flex items-center gap-2">
        <span class="uppercase">{{ item.label }}</span>
        <span v-if="item.count" class="inline-flex rounded-full bg-primary-800 w-5 h-5 items-center justify-center text-xs text-primary">
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
