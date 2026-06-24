<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <section aria-label="Favorites">
    <template v-if="exchange.favorites.length === 0 ">
      <AppTabEmpty class="max-w-115">
        <template #heading>
          No pinned pairs yet
        </template>
        Pin a pair to track its rate here. Tap the star icon on any conversion or comparison row.
      </AppTabEmpty>
    </template>

    <UCard
      v-else
      title="Pinned Pairs"
      :description="`${exchange.favorites.length} favorite${exchange.favorites.length === 1 ? '' : 's'}`"
    >
      <div class="space-y-4">
        <ItemFavorite
          v-for="pair in exchange.favorites"
          :key="`favorite-item-${pair.base}-${pair.quote}`"
          :pair
        />
      </div>
    </UCard>
  </section>
</template>
