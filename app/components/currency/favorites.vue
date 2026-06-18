<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <section class="favorites-component" aria-labelledby="favorites-component-heading">
    <h2 id="favorites-component-heading">
      Favorites
    </h2>

    <template v-if="exchange.favorites.length === 0 ">
      <h3>No pinned pairs yet</h3>
      <p>Pin a pair to track its rate here. Tap the star icon on any conversion or comparison row.</p>
    </template>

    <template v-else>
      <header class="favorites-header">
        <div class="heading">
          Pinned Pairs
        </div>
        <div class="num-pairs">
          {{ exchange.favorites.length }} favorite{{ exchange.favorites.length === 1 ? '' : 's' }}
        </div>
      </header>

      <div class="favorites-list">
        <div
          v-for="pair in exchange.favorites"
          :key="`favorite-${pair.base}-${pair.quote}`"
          class="favorites-item"
        >
          <span class="base-iso-code">{{ pair.base }}</span>
          <img src="/icon-arrow-right.svg" alt="arrow">
          <span class="quote-iso-code">{{ pair.quote }}</span>
          <span>(current rate)</span>
          <span>(percent change 24hrs)</span>

          <button
            v-if="exchange.doesFavoriteExist(pair.base, pair.quote)"
            class="button-unfavorite"
            @click="exchange.deleteFavorite(pair.base, pair.quote)"
          >
            <img src="/icon-star-filled.svg" alt="">
            Favorited
          </button>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.favorites-component > * + * {
  margin-block-start: 1rem;
}

.favorites-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1ch;
}

.favorites-list > * + * {
  margin-block-start: 1rem;
}

.favorites-item {
  display: flex;
  gap: 1ch;
}
</style>
