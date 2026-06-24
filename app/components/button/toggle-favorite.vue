<script setup lang="ts">
type Props = {
  pair: Pair;
};

const { pair } = defineProps<Props>();

const exchange = useExchangeStore();

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
    size="sm"
    square
    :variant="isFavorited ? 'outline' : 'subtle'"
    :color="isFavorited ? 'primary' : 'neutral'"
    :icon="isFavorited ? 'ion:star' : 'ion:star-outline'"
    :aria-label="isFavorited ? 'Unfavorite this pair' : 'Favorite this pair'"
    :aria-pressed="isFavorited"
    @click.stop="toggleFavorite"
  />
</template>
