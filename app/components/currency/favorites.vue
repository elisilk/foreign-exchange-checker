<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <section aria-label="Favorites">
    <template v-if="exchange.favorites.length === 0 ">
      <h3>No pinned pairs yet</h3>
      <p>Pin a pair to track its rate here. Tap the star icon on any conversion or comparison row.</p>
    </template>

    <UCard
      v-else
      title="Pinned Pairs"
      :description="`${exchange.favorites.length} favorite${exchange.favorites.length === 1 ? '' : 's'}`"
    >
      <div class="favorites-list">
        <div
          v-for="pair in exchange.favorites"
          :key="`favorite-${pair.base}-${pair.quote}`"
          class="favorites-item"
        >
          <div class="pair">
            <span class="base-iso-code">{{ pair.base }}</span>
            <UIcon name="ion:arrow-forward" class="size-5" />
            <span class="quote-iso-code">{{ pair.quote }}</span>
          </div>

          <div class="rate">
            <span>(rate)</span>
            <span>(% change)</span>
          </div>

          <UButton
            v-if="exchange.doesFavoriteExist(pair.base, pair.quote)"
            aria-label="Unfavorite this pair"
            icon="ion:star"
            variant="outline"
            size="sm"
            square
            @click="exchange.deleteFavorite(pair.base, pair.quote)"
          />
        </div>
      </div>
    </UCard>
  </section>
</template>

<style scoped>
.favorites-list > * + * {
  margin-block-start: 1rem;
}

.favorites-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid grey;
  background: black;
}

.pair {
  display: flex;
  align-items: center;
  gap: 1ch;
}

.rate {
  margin-inline-start: auto;
  display: grid;
  justify-items: end;
}
</style>
