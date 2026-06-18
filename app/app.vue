<script setup lang="ts">
const exchange = useExchangeStore();

await useAsyncData("initRates", async () => {
  await exchange.fetchCurrencies();
  await exchange.fetchRates();
  return true;
});

// onMounted(async () => {
//   await currency.fetchRates();
// });

watch(
  [() => exchange.base, () => exchange.quote],
  async (/* [newBase, newQuote], [_oldBase, _oldQuote] */) => {
    // console.log(`new state: ${newBase} / ${newQuote}`);
    try {
      await exchange.fetchRates();
    }
    catch (error) {
      console.error("Error fetching new rates:", error);
    }
  },
);
</script>

<template>
  <div>
    <AppHeader />

    <main class="main" aria-labelledby="main-heading">
      <h1 id="main-heading">
        Foreign Exchange Checker
      </h1>

      <section class="picker" aria-labelledby="picker-component-heading">
        <h2 id="picker-component-heading">
          Pick Currencies
        </h2>

        <CurrencyPicker
          id="base"
          v-model="exchange.base"
        />

        <CurrencyPicker
          id="quote"
          v-model="exchange.quote"
        />

        <CurrencySwap />

        <button
          v-if="exchange.doesFavoriteExist(exchange.base, exchange.quote)"
          class="button-favorite"
          @click="exchange.deleteFavorite(exchange.base, exchange.quote)"
        >
          <img src="/icon-star-filled.svg" alt="">
          Favorited
        </button>
        <button
          v-else
          class="button-favorite"
          @click="exchange.addFavorite(exchange.base, exchange.quote)"
        >
          <img src="/icon-star.svg" alt="">
          Favorite
        </button>

        <CurrencyRate />
      </section>

      <CurrencyFavorites />

      <CurrencyConverter />

      <CurrencyCompare />

      <CurrencyTicker :base="exchange.base" />
    </main>

    <footer aria-labelledby="footer-heading">
      <h2 id="footer-heading">
        Icon Inspector
      </h2>
      <div style="background: black; height: 100px; width: 100px; display: grid; place-items: center;">
        <img
          src="/icon-star-filled.svg"
          alt=""
        >
      </div>
    </footer>
  </div>
</template>

<style scoped>
.main > * + *,
.picker > * + * {
  margin-block-start: 1rem;
}
</style>
