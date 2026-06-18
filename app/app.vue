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

        <CurrencyRate />
      </section>

      <CurrencyFavorites />

      <CurrencyConverter />

      <CurrencyCompare />

      <CurrencyTicker :base="exchange.base" />
    </main>
  </div>
</template>

<style scoped>
.main > * + *,
.picker > * + * {
  margin-block-start: 1rem;
}
</style>
