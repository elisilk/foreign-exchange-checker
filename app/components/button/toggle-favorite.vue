<script setup lang="ts">
type Props = {
  pair: Pair;
  variant?: "icon-only" | "icon-plus-label";
};

const { pair, variant = "icon-only" } = defineProps<Props>();

const exchange = useExchangeStore();

const includeLabel = computed<boolean>(() => variant === "icon-plus-label");

const isFavorited = computed<boolean>(() => exchange.doesFavoriteExist(pair.base, pair.quote));

function toggleFavorite() {
  if (isFavorited.value) {
    exchange.deleteFavorite(pair.base, pair.quote);
  }
  else {
    exchange.addFavorite(pair.base, pair.quote);
  }
}
</script>

<template>
  <UButton
    :class="[includeLabel ? 'h-8 w-29.25' : '']"
    :label="includeLabel ? `Favorite${isFavorited ? 'd' : ''}` : undefined"
    :size="includeLabel ? 'md' : 'sm'"
    :square="includeLabel ? false : true"
    :variant="isFavorited ? (includeLabel ? 'solid' : 'outline') : 'subtle'"
    :color="isFavorited ? 'primary' : 'neutral'"
    :icon="isFavorited ? 'ion:star' : 'ion:star-outline'"
    :aria-label="isFavorited ? 'Unfavorite this pair' : 'Favorite this pair'"
    :aria-pressed="isFavorited"
    @click.stop="toggleFavorite"
  />
</template>
