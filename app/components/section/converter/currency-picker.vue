<script setup lang="ts">
import type { SelectMenuItem } from "@nuxt/ui";

type CurrencySelectMenuItemMetaData = {
  id?: string;
  popular?: boolean;
};

type CurrencySelectMenuItem = Extract<SelectMenuItem, Record<string, any>> & CurrencySelectMenuItemMetaData;

type Props = {
  id: string;
};

const { id } = defineProps<Props>();

const exchange = useExchangeStore();

const selectedCurrency = defineModel<string>();

const elementId = computed(() => `currency-select-${id}`);

const selectedFlagIcon = computed(() => selectedCurrency.value ? currencyMeta[selectedCurrency.value]?.flagIcon : "");

const currencyMenuItems = computed<CurrencySelectMenuItem[]>(() => {
  const items = [...exchange.availableCurrencies].map((item: string): CurrencySelectMenuItem => {
    const currency: CurrencyMeta | undefined = currencyMeta[item];
    return {
      type: "item",
      id: item,
      label: item,
      name: currency?.name,
      icon: currency?.flagIcon,
      popular: currency?.popular || false,
    };
  });

  const popularItems = items.filter((item: CurrencySelectMenuItem) => item.popular);

  const otherItems = items.filter((item: CurrencySelectMenuItem) => !item.popular);

  const combinedItems: CurrencySelectMenuItem[] = [
    {
      type: "label",
      label: `Popular ${popularItems.length}`,
    },
    ...popularItems,
    {
      type: "label",
      label: `Other Currencies ${otherItems.length}`,
    },
    ...otherItems,
  ];

  return combinedItems;
});
</script>

<template>
  <USelectMenu
    :id="elementId"
    v-model="selectedCurrency"
    trailing-icon="ion:arrow-down-b"
    :icon="selectedFlagIcon"
    value-key="id"
    :items="currencyMenuItems"
    class="w-26 h-10"
    :filter-fields="['label', 'name']"
    :search-input="{
      placeholder: 'Search currencies ...',
      icon: 'ion:search',
    }"
    :content="{
      align: 'end',
      side: 'bottom',
      sideOffset: 8,
    }"
  >
    <template #item-label="{ item }">
      {{ item.label }}
      <span class="text-default">
        {{ item.name }}
      </span>
    </template>
  </USelectMenu>
</template>
