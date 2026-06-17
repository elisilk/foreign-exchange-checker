<script setup lang="ts">
const currency = useCurrencyStore();

await useAsyncData("initRates", async () => {
  await currency.fetchCurrencies();
  await currency.fetchRates();
  return true;
});

// onMounted(async () => {
//   await currency.fetchRates();
// });

watch(
  [() => currency.base, () => currency.quote],
  async (/* [newBase, newQuote], [_oldBase, _oldQuote] */) => {
    // console.log(`new state: ${newBase} / ${newQuote}`);
    try {
      await currency.fetchRates();
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

    <main class="main">
      <CurrencyPicker
        id="base"
        v-model="currency.base"
      />

      <CurrencyPicker
        id="quote"
        v-model="currency.quote"
      />

      <CurrencySwap />

      <CurrencyRate />

      <CurrencyConverter />

      <CurrencyCompare />

      <CurrencyTicker :base="currency.base" />
    </main>
  </div>
</template>

<style scoped>
.main > * + * {
  margin-block-start: 1rem;
}
</style>
