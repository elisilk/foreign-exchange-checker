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
</script>

<template>
  <section
    :aria-label="`Ticker pair: ${pair.base} to ${pair.quote}`"
    class="flex px-4 gap-2.5"
  >
    <div class="flex items-center text-xs md:text-sm">
      <span>{{ pair.base }}</span>/<span>{{ pair.quote }}</span>
    </div>

    <div class="ms-auto flex items-center gap-1.5">
      <!-- latest rate -->
      <span class="text-highlighted text-xs md:text-md">{{ rateLatest }}</span>

      <!-- percent change -->
      <div class="flex gap-1 items-center text-xs md:text-sm" :class="[ratePercentChange.isPositive ? 'text-success' : 'text-error']">
        <UIcon :name="ratePercentChange.isPositive ? 'ion:arrow-up-b' : 'ion:arrow-down-b'" class="size-3" />
        <span>{{ ratePercentChange.percentChange }}</span>
      </div>
    </div>
  </section>
</template>
