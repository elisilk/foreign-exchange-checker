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
      <TransitionGroup
        name="list"
        tag="ul"
        class="space-y-4"
      >
        <SectionFavoritesItem
          v-for="pair in exchange.favorites"
          :key="`favorite-item-${pair.base}-${pair.quote}`"
          :pair
        />
      </TransitionGroup>
    </UCard>
  </section>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
