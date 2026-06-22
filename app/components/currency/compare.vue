<script setup lang="ts">
const exchange = useExchangeStore();

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
</script>

<template>
  <section class="compare-component" aria-label="Compare">
    <template v-if="!exchange.amount">
      <h3>No comparison available</h3>
      <p>Enter an amount in <span>SEND</span> above to see what your money is worth in other currencies.</p>
    </template>

    <template v-else-if="!exchange.rates || exchange.rates.length === 0">
      <h3>No rates available</h3>
      <p>There was an issue getting the latest rates. Try to refresh the page or come back again later. Sorry!</p>
    </template>

    <UCard
      v-else
      :title="`Multi-currency ${exchange.amount.toLocaleString('en-US', {
        maximumFractionDigits: 2,
      })} from ${exchange.base}`"
      :description="`${exchange.rates.length} pairs`"
    >
      <div class="compare-list">
        <div
          v-for="pair in exchange.rates"
          :key="`compare-${pair.base}-${pair.quote}`"
          class="compare-item"
        >
          <UIcon
            :name="getFlagIcon(pair.quote as CurrencyCode)"
            class="flag size-5"
          />

          <div class="currency">
            <span class="iso-code">{{ pair.quote }}</span>
            <span class="name">(currency name)</span>
          </div>

          <div class="amounts">
            <span class="result">{{ formatter.format(exchange.amount * pair.rate) }}</span>
            <span class="rate">@ {{ pair.rate.toPrecision(5) }}</span>
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

<style scoped>
.compare-list > * + * {
  margin-block-start: 1rem;
}

.compare-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid grey;
  background: black;
}

.currency {
  display: grid;
}

.amounts {
  margin-inline-start: auto;
  display: grid;
  justify-items: end;
}
</style>
