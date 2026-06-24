<script setup lang="ts">
type Props = {
  pair: Pair;
};

const { pair } = defineProps<Props>();

const exchange = useExchangeStore();

const index = 1;

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
        <span class="text-xl text-neutral-50">1.3575</span>
        <template v-if="index % 2 === 0">
          <span class="text-xs text-red-500 flex gap-1 items-center">
            <UIcon name="ion:arrow-down-b" class="size-3" />
            <span>-0.22%</span>
          </span>
        </template>
        <template v-else>
          <div class="text-xs text-primary flex gap-1 items-center">
            <UIcon name="ion:arrow-up-b" class="size-3" />
            <span>+0.34%</span>
          </div>
        </template>
      </div>
    </button>

    <ButtonToggleFavorite :pair />
  </section>
</template>
