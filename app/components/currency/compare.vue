<script setup lang="ts">
const exchange = useExchangeStore();

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function getCurrencyName(isoCode: string): string | undefined {
  const currency = currencies.find(item => item.iso_code === isoCode);
  if (!currency)
    return undefined;
  return currency.name;
}
</script>

<template>
  <section class="compare-component" aria-label="Compare">
    <template v-if="!exchange.amount">
      <AppTabEmpty class="max-w-115">
        <template #heading>
          No comparison available
        </template>
        Enter an amount in <span>SEND</span> above to see what your money is worth in other currencies.
      </AppTabEmpty>
    </template>

    <template v-else-if="!exchange.rates || exchange.rates.length === 0">
      <AppTabEmpty class="max-w-115">
        <template #heading>
          No rates available
        </template>
        There was an issue getting the latest rates. Try to refresh the page or come back again later. Sorry!
      </AppTabEmpty>
    </template>

    <UCard
      v-else
      :description="`${exchange.rates.length} pairs`"
    >
      <template #title>
        <span class="text-lg text-neutral-200">Multi-currency</span>
        <span>{{ exchange.amount.toLocaleString('en-US', {
          maximumFractionDigits: 2,
        }) }} from {{ exchange.base }}</span>
      </template>
      <div class="space-y-4">
        <div
          v-for="pair in exchange.rates"
          :key="`compare-${pair.base}-${pair.quote}`"
          class="flex items-center gap-4 py-3 px-4 border border-neutral-500 rounded-lg bg-neutral-600"
        >
          <UIcon
            :name="getFlagIcon(pair.quote as CurrencyCode)"
            class="flag size-6"
          />

          <div class="grid gap-1.5">
            <span class="text-lg text-neutral-50">{{ pair.quote }}</span>
            <span class="text-sm text-neutral-200">{{ getCurrencyName(pair.quote) }}</span>
          </div>

          <div class="ms-auto grid gap-1.5 justify-items-end">
            <span class="text-xl text-neutral-50">{{ formatter.format(exchange.amount * pair.rate) }}</span>
            <span class="text-xs text-neutral-200">@ {{ pair.rate.toPrecision(5) }}</span>
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
          <UButton
            v-else
            aria-label="Favorite this pair"
            icon="ion:star-outline"
            variant="subtle"
            color="neutral"
            size="sm"
            square
            @click="exchange.addFavorite(pair.base, pair.quote)"
          />
        </div>
      </div>
    </UCard>
  </section>
</template>
