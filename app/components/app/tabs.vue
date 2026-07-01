<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

const exchange = useExchangeStore();

const items = computed<TabsItem[]>(() => [
  {
    slot: "history",
    value: "history",
    label: "History",
  },
  {
    slot: "compare",
    value: "compare",
    label: "Compare",
  },
  {
    slot: "favorites",
    value: "favorites",
    label: "Favorites",
    badge: exchange.favorites.length,
  },
  {
    slot: "log",
    value: "log",
    label: "Log",
    badge: exchange.conversionLog.length,
  },
]);
</script>

<template>
  <UTabs
    v-model="exchange.activeTab"
    :items
    variant="link"
    :unmount-on-hide="false"
    class="gap-4 md:gap-5"
  >
    <template #history>
      <CurrencyHistory />
    </template>

    <template #compare>
      <CurrencyCompare />
    </template>

    <template #favorites>
      <CurrencyFavorites />
    </template>

    <template #log>
      <CurrencyLog />
    </template>
  </UTabs>
</template>
