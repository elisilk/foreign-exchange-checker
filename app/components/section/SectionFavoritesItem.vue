<script setup lang="ts">
type Props = {
  pair: Pair;
};

const { pair } = defineProps<Props>();

const exchange = useExchangeStore();

const rateLatest = computed(() => exchange.getPairRateAsString(pair.base, pair.quote));

const ratePercentChange = computed(
  () => exchange.getPairRatePercentChange(pair.base, pair.quote),
);

function handleItemClick() {
  exchange.sendCurrency = pair.base;
  exchange.receiveCurrency = pair.quote;
  scrollToTop();
}
</script>

<template>
  <li
    :aria-label="`Favorited pair: ${pair.base} to ${pair.quote}`"
    class="relative flex items-center gap-4 py-3 px-4 border border-muted rounded-lg bg-elevated has-[.item-data:hover]:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:outline-none"
  >
    <button class="item-data flex-1 min-w-0 bg-transparent border-none cursor-pointer p-0 rounded-lg flex items-center justify-between gap-4 focus:outline-none after:absolute after:inset-0" @click="handleItemClick">
      <div class="flex items-center gap-2 text-lg text-highlighted">
        <span>{{ pair.base }}</span>
        <UIcon name="ion:arrow-forward" class="size-3 text-default" />
        <span>{{ pair.quote }}</span>
      </div>

      <div class="grid gap-1.5 justify-items-end">
        <!-- latest rate -->
        <span class="text-xl text-highlighted">{{ rateLatest }}</span>

        <!-- percent change -->
        <div class="text-xs flex gap-1 items-center" :class="[ratePercentChange.isPositive ? 'text-primary' : 'text-red-500']">
          <UIcon :name="ratePercentChange.isPositive === true ? 'ion:arrow-up-b' : 'ion:arrow-down-b'" class="size-3" />
          <span>{{ ratePercentChange.percentChange }}</span>
        </div>
      </div>
    </button>

    <ButtonToggleFavorite :pair />
  </li>
</template>
