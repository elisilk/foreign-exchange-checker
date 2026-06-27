<script setup lang="ts">
type Props = {
  pair: Pair;
};

const { pair } = defineProps<Props>();

const exchange = useExchangeStore();

const rateLatest = computed(() => exchange.rateForPair(pair.base, pair.quote));

const ratePrevious = computed(() => exchange.rateForPair(pair.base, pair.quote, "previous"));

const ratePercentChange = computed<number>(() => (rateLatest.value === undefined || ratePrevious.value === undefined) ? 0 : Number((100 * (rateLatest.value - ratePrevious.value) / ratePrevious.value).toPrecision(2)));

const ratePercentChangeIsPositive = computed<boolean>(() => ratePercentChange.value >= 0);
</script>

<template>
  <section
    :aria-label="`Ticker pair: ${pair.base} to ${pair.quote}`"
    class="flex px-4 gap-2.5"
  >
    <div class="flex items-center text-xs md:text-sm text-neutral-200">
      <span>{{ pair.base }}</span>/<span>{{ pair.quote }}</span>
    </div>

    <div class="ms-auto flex items-center gap-1.5">
      <!-- latest rate -->
      <span class="text-neutral-50 text-xs md:text-md">{{ rateLatest }}</span>

      <!-- percent change -->
      <div class="flex gap-1 items-center text-xs md:text-sm" :class="[ratePercentChangeIsPositive ? 'text-primary' : 'text-red-500']">
        <UIcon :name="ratePercentChangeIsPositive === true ? 'ion:arrow-up-b' : 'ion:arrow-down-b'" class="size-3" />
        <span>{{ ratePercentChangeIsPositive === true ? '+' : '' }}{{ ratePercentChange.toFixed(2) }}%</span>
      </div>
    </div>
  </section>
</template>
