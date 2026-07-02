<script setup lang="ts">
const exchange = useExchangeStore();

const isEmpty = computed<boolean>(() => exchange.tickerPairs.length === 0 && exchange.favorites.length === 0);

// TODO: deduplicate this array at some point
const pairs = computed<Pair[]>(() => [...exchange.tickerPairs, ...exchange.favorites]);
</script>

<template>
  <section aria-labelledby="ticker-section-heading" class="flex bg-muted h-8.5 md:h-10">
    <h2 id="ticker-section-heading" class="bg-primary text-inverted text-xs md:text-md uppercase flex shrink-0 items-center justify-center w-25.5 md:w-34.5 gap-2">
      <span aria-hidden="true" class="w-1.5 h-1.5 rounded-full bg-current -indent-250">&middot;</span>
      Live Markets
    </h2>

    <UMarquee
      pause-on-hover
      :overlay="false"
    >
      <div v-if="isEmpty" class="text-xs md:text-sm">
        No ticker pairs selected
      </div>
      <div v-else class="flex divide-x divide-accented border-r border-accented">
        <ItemTicker
          v-for="pair in pairs"
          :key="`ticker-item-${pair.base}-${pair.quote}`"
          :pair
        />
      </div>
    </UMarquee>
  </section>
</template>
