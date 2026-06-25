<script setup lang="ts">
type Props = {
  pair: Pair;
};

const { pair } = defineProps<Props>();

const exchange = useExchangeStore();

const rateToday = computed(() => exchange.rateForPair(pair.base, pair.quote));

const rateYesterday = computed(() => exchange.rateForPair(pair.base, pair.quote, "yesterday"));

const ratePercentChange = computed<number>(() => (rateToday.value === undefined || rateYesterday.value === undefined) ? 0 : Number((100 * (rateToday.value - rateYesterday.value) / rateYesterday.value).toPrecision(2)));

const ratePercentChangeIsPositive = computed<boolean>(() => ratePercentChange.value >= 0);

function handleItemClick() {
  exchange.base = pair.base as CurrencyCode;
  exchange.quote = pair.quote as CurrencyCode;
}
</script>

<template>
  <section
    :aria-label="`Favorited pair: ${pair.base} to ${pair.quote}`"
    class="relative flex items-center gap-4 py-3 px-4 border border-neutral-500 rounded-lg bg-neutral-600 has-[.item-data:hover]:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:outline-none"
  >
    <button class="item-data flex-1 min-w-0 bg-transparent border-none cursor-pointer p-0 rounded-lg flex items-center gap-4 focus:outline-none after:absolute after:inset-0" @click="handleItemClick">
      <div class="flex items-center gap-2 text-lg text-neutral-50">
        <span>{{ pair.base }}</span>
        <UIcon name="ion:arrow-forward" class="size-3 text-neutral-200" />
        <span>{{ pair.quote }}</span>
      </div>

      <div class="ms-auto grid gap-1.5 justify-items-end">
        <!-- today's rate -->
        <span class="text-xl text-neutral-50">{{ rateToday }}</span>

        <!-- percent change -->
        <div class="text-xs flex gap-1 items-center" :class="[ratePercentChangeIsPositive ? 'text-primary' : 'text-red-500']">
          <UIcon :name="ratePercentChangeIsPositive === true ? 'ion:arrow-up-b' : 'ion:arrow-down-b'" class="size-3" />
          <span>{{ ratePercentChangeIsPositive === true ? '+' : '' }}{{ ratePercentChange.toFixed(2) }}%</span>
        </div>
      </div>
    </button>

    <ButtonToggleFavorite :pair />
  </section>
</template>
