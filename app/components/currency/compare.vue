<script setup lang="ts">
const exchange = useExchangeStore();

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
</script>

<template>
  <section class="compare-component" aria-labelledby="compare-component-heading">
    <h2 id="compare-component-heading">
      Compare
    </h2>

    <template v-if="!exchange.amount">
      <h3>No comparison available</h3>
      <p>Enter an amount in <span>SEND</span> above to see what your money is worth in other currencies.</p>
    </template>

    <template v-else-if="!exchange.rates || exchange.rates.length === 0">
      <h3>No rates available</h3>
      <p>There was an issue getting the latest rates. Try to refresh the page or come back again later. Sorry!</p>
    </template>

    <template v-else>
      <header class="compare-header">
        <div class="heading">
          Multi-currency
        </div>
        <div class="base-amount">
          {{ exchange.amount.toLocaleString('en-US', {
            maximumFractionDigits: 2,
          }) }} from {{ exchange.base }}
        </div>
        <div class="num-pairs">
          {{ exchange.rates.length }} pairs
        </div>
      </header>

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
          <span class="iso-code">{{ pair.quote }}</span>
          <span class="name">(currency name)</span>
          <span class="rate">@ {{ pair.rate.toPrecision(5) }}</span>
          <span class="result">{{ formatter.format(exchange.amount * pair.rate) }}</span>

          <UButton
            v-if="exchange.doesFavoriteExist(pair.base, pair.quote)"
            class="button-favorite"
            icon="ion:star"
            @click="exchange.deleteFavorite(pair.base, pair.quote)"
          >
            Favorited
          </UButton>
          <UButton
            v-else
            class="button-favorite"
            icon="ion:star-outline"
            @click="exchange.addFavorite(pair.base, pair.quote)"
          >
            Favorite
          </UButton>
        </div>
      </div>
    </template>
  </section>
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
  place-self: end;
}
</style>
