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

const searchTerm = ref("");

const dynamicGroupedCurrencyItems = computed<CurrencySelectMenuItem[][]>(() => {
  const query = searchTerm.value.toLowerCase().trim();

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

  // Match against either the 'label' OR the 'name' field
  const filterFn = (item: any) => {
    return item.label?.toLowerCase().includes(query)
      || item.name?.toLowerCase().includes(query);
  };

  const filteredPopular = popularItems.filter(filterFn);
  const filteredOther = otherItems.filter(filterFn);

  return [
    [
      {
        type: "label",
        label: `Popular ${filteredPopular.length}`,
        // label: "Popular",
        // count: filteredPopular.length,
      },
      ...filteredPopular,
    ],
    [
      {
        type: "label",
        label: `Other Currencies ${filteredOther.length}`,
        // label: "Other Currencies",
        // count: filteredOther.length,
      },
      ...filteredOther,
    ],
  ];
});
</script>

<template>
  <USelectMenu
    :id="elementId"
    v-model="selectedCurrency"
    v-model:search-term="searchTerm"
    value-key="id"
    :items="dynamicGroupedCurrencyItems"
    ignore-filter
    trailing-icon="ion:arrow-down-b"
    :icon="selectedFlagIcon"
    :search-input="{
      placeholder: 'Search currencies ...',
      icon: 'ion:search',
      ui: {
        base: 'ps-9 pe-3 py-3',
        leadingIcon: 'text-highlighted',
      },
    }"
    :content="{
      align: 'end',
      side: 'bottom',
      sideOffset: 8,
      collisionPadding: 32,
    }"
  >
    <template #item-label="{ item }">
      {{ item.label }}
      <span class="text-default">
        {{ item.name }}
      </span>
    </template>
    <template #empty>
      No matching currencies
    </template>
  </USelectMenu>
</template>
