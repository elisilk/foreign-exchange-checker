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
        <div
          v-for="(pair, index) in exchange.favorites"
          :key="`favorite-${pair.base}-${pair.quote}`"
          class="flex items-center gap-4 py-3 px-4 border border-neutral-500 rounded-lg bg-neutral-600"
        >
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
