<script setup lang="ts">
const currency = useCurrencyStore();

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
</script>

<template>
  <div class="compare-component">
    <h2>Compare</h2>

    <template v-if="!currency.amount">
      <h3>No comparison available</h3>
      <p>Enter an amount in SEND above to see what your money is worth in other currencies.</p>
    </template>

    <template v-else-if="!currency.rates || currency.rates.length === 0">
      <h3>No rates available</h3>
      <p>There was an issue getting the latest rates. Try to refresh the page or come back again later. Sorry!</p>
    </template>

    <template v-else>
      <header class="compare-header">
        <div class="heading">
          Multi-currency
        </div>
        <div class="base-amount">
          {{ currency.amount.toLocaleString('en-US', {
            maximumFractionDigits: 2,
          }) }} from {{ currency.base }}
        </div>
        <div class="num-pairs">
          {{ currency.rates.length }} pairs
        </div>
      </header>

      <div class="compare-list">
        <div
          v-for="pair in currency.rates"
          :key="`compare-${pair.base}-${pair.quote}`"
          class="compare-item"
        >
          <span class="flag">(flag)</span>
          <span class="iso-code">{{ pair.quote }}</span>
          <span class="name">(currency name)</span>
          <span class="rate">@ {{ pair.rate.toPrecision(5) }}</span>
          <span class="result">{{ formatter.format(currency.amount * pair.rate) }}</span>
          <button class="button-favorite">
            Favorite
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.compare-component > * + * {
  margin-block-start: 1rem;
}

.compare-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1ch;
}

.base-amount {
  flex-grow: 1;
}

.compare-list > * + * {
  margin-block-start: 1rem;
}

.compare-item {
  display: grid;
  grid-template-areas:
    "flag code result fav"
    "flag name rate fav";
  gap: 1ch;
}

.iso-code {
  grid-area: code;
}

.name {
  grid-area: name;
}

.rate {
  grid-area: rate;
}

.result {
  grid-area: result;
}

.button-favorite {
  grid-area: fav;
}
</style>
