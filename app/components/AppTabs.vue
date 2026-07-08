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

const activeItemBadge = computed(() => {
  return items.value.find(item => item.value === exchange.activeTab)?.badge;
});
</script>

<template>
  <USelectMenu
    v-model="exchange.activeTab"
    value-key="value"
    :items
    :search-input="false"
    class="sm:hidden w-full"
    :ui="{
      content: 'bg-muted',
      viewport: 'pt-0',
      base: 'uppercase bg-muted border-accented',
      itemLabel: 'uppercase flex gap-2 items-center',
    }"
  >
    <template #default="{ modelValue }">
      {{ modelValue }}
      <UBadge
        v-if="activeItemBadge"
        class="ring-0 inline-flex rounded-full bg-primary-200 dark:bg-primary-800 w-5 h-5 px-0 py-0 items-center justify-center text-xs text-primary"
      >
        {{ activeItemBadge }}
      </UBadge>
    </template>
    <template #item-label="{ item }">
      {{ item.label }}
      <UBadge
        v-if="item.badge"
        class="ring-0 inline-flex rounded-full bg-primary-200 dark:bg-primary-800 w-5 h-5 px-0 py-0 items-center justify-center text-xs text-primary"
      >
        {{ item.badge }}
      </UBadge>
    </template>
  </USelectMenu>

  <UTabs
    v-model="exchange.activeTab"
    :items
    variant="link"
    :unmount-on-hide="false"
    class="gap-4 md:gap-5"
    :ui="{ list: 'hidden sm:flex' }"
  >
    <template #history>
      <SectionHistory />
    </template>

    <template #compare>
      <SectionCompare />
    </template>

    <template #favorites>
      <SectionFavorites />
    </template>

    <template #log>
      <SectionLog />
    </template>
  </UTabs>
</template>
