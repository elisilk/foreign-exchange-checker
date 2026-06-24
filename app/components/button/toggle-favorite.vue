<script setup lang="ts">
type Props = {
  base: string;
  quote: string;
};

const { base, quote } = defineProps<Props>();

const exchange = useExchangeStore();

const isFavorited = computed<boolean>(() => exchange.doesFavoriteExist(base, quote));

function toggleFavorite() {
  // console.log(`toggling favorite: ${base}/${quote}`);
  if (isFavorited.value) {
    exchange.deleteFavorite(base, quote);
  }
  else {
    exchange.addFavorite(base, quote);
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
    @keydown.enter.stop="toggleFavorite"
    @keydown.space.stop.prevent="toggleFavorite"
  />
</template>
