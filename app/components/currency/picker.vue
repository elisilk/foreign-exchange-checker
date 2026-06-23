<script setup lang="ts">
import type { SelectMenuItem } from "@nuxt/ui";

type Props = {
  id: string;
};

const { id } = defineProps<Props>();

const exchange = useExchangeStore();

const selectedCurrency = defineModel<string>();

const elementId = computed(() => `currency-select-${id}`);

const selectedFlagIcon = computed(() => getFlagIcon(selectedCurrency.value as CurrencyCode));

const currenciesMenuItems = computed<SelectMenuItem[]>(() => [...exchange.currencies].map((item) => {
  return {
    id: item.iso_code,
    label: item.iso_code,
    name: item.name,
    icon: getFlagIcon(item.iso_code as CurrencyCode),
  };
}));
</script>

<template>
  <USelectMenu
    :id="elementId"
    v-model="selectedCurrency"
    :icon="selectedFlagIcon"
    value-key="id"
    :items="currenciesMenuItems"
    class="w-26 h-10"
    :filter-fields="['label', 'name']"
    :search-input="{
      placeholder: 'Search currencies ...',
      icon: 'ion:search',
    }"
    :ui="{
      input: 'text-neutral-50',
      content: 'min-w-max',
      item: 'items-center',
    }"
  >
    <template #item-label="{ item }: { item: any }">
      {{ item.label }}
      <span class="text-muted">
        {{ item.name }}
      </span>
    </template>
  </USelectMenu>
</template>
