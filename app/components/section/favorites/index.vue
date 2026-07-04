<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <section aria-label="Favorites">
    <UEmpty
      v-if="exchange.favorites.length === 0"
      title="No pinned pairs yet"
      description="Pin a pair to track its rate here. Tap the star icon on any conversion or comparison row."
    />

    <UCard
      v-else
      title="Pinned Pairs"
      :description="`${exchange.favorites.length} favorite${exchange.favorites.length === 1 ? '' : 's'}`"
    >
      <div class="space-y-4">
        <SectionFavoritesItem
          v-for="pair in exchange.favorites"
          :key="`favorite-item-${pair.base}-${pair.quote}`"
          :pair
        />
      </div>
    </UCard>
  </section>
</template>
