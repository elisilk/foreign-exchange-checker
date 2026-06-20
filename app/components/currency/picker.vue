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
    label: `${item.iso_code} ${item.name}`,
    icon: getFlagIcon(item.iso_code as CurrencyCode),
  };
}));
</script>

<template>
  <label>
    <span>{{ id }}:</span>
    <USelectMenu
      :id="elementId"
      v-model="selectedCurrency"
      :icon="selectedFlagIcon"
      value-key="id"
      :items="currenciesMenuItems"
      class="w-72"
    />
  </label>
</template>
