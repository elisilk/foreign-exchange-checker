<script setup lang="ts">
import type { SelectMenuItem } from "@nuxt/ui";

const { id } = defineProps<Props>();

type Props = {
  id: string;
};

type ValidCurrencyMenuItem = SelectMenuItem & {
  label: string;
  name: string;
};

function isCurrencyMenuItem(item: unknown): item is ValidCurrencyMenuItem {
  return (
    typeof item === "object"
    && item !== null
    && "label" in item
    && typeof (item as any).label === "string"
    && "name" in item
    && typeof (item as any).name === "string"
  );
}

// Match against either the 'label' OR the 'name' field
function currencyMenuFilterFn(item: ValidCurrencyMenuItem, query: string) {
  return item.label.toLowerCase().includes(query)
    || item.name.toLowerCase().includes(query);
}

const exchange = useExchangeStore();

const selectedCurrency = defineModel<string>();

const elementId = computed(() => `currency-select-${id}`);

const selectedFlagIcon = computed(() => selectedCurrency.value ? currencyMeta[selectedCurrency.value]?.flagIcon : "");

const searchTerm = ref("");

const dynamicGroupedCurrencyItems = computed<SelectMenuItem[][]>(() => {
  const popularItems = [];
  const otherItems = [];

  const query = searchTerm.value.toLowerCase().trim();

  for (const code of exchange.availableCurrencies) {
    const meta = currencyMeta[code];
    if (!meta)
      continue;

    const menuItem: ValidCurrencyMenuItem = {
      id: code,
      label: code,
      name: meta.name,
      icon: meta.flagIcon,
    };

    if (meta.popular) {
      popularItems.push(menuItem);
    }
    else {
      otherItems.push(menuItem);
    }
  }

  const filteredPopular = popularItems.filter(item => currencyMenuFilterFn(item, query));

  const filteredOther = otherItems.filter(item => currencyMenuFilterFn(item, query));

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
      <template v-if="isCurrencyMenuItem(item)">
        {{ item.label }}
        <span class="text-default">
          {{ item.name }}
        </span>
      </template>

      <template v-else-if="item && typeof item === 'object' && 'label' in item">
        {{ item.label }}
      </template>

      <template v-else>
        {{ item }}
      </template>
    </template>

    <template #empty>
      No matching currencies
    </template>
  </USelectMenu>
</template>
