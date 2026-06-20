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
  <UApp class="font-sans antialiased">
    <AppHeader />

    <UContainer>
      <UMain class="main" aria-labelledby="main-heading">
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

          <UButton
            v-if="exchange.doesFavoriteExist(exchange.base, exchange.quote)"
            class="button-favorite"
            @click="exchange.deleteFavorite(exchange.base, exchange.quote)"
          >
            <UIcon name="ion:star" class="size-5" />
            Favorited
          </UButton>

          <UButton
            v-else
            class="button-favorite"
            @click="exchange.addFavorite(exchange.base, exchange.quote)"
          >
            <UIcon name="ion:star-outline" class="size-5" />
            Favorite
          </UButton>

          <CurrencyRate />
        </section>

        <CurrencyConverter />

        <CurrencyLog />

        <CurrencyFavorites />

        <CurrencyCompare />

        <!-- <CurrencyTicker :base="exchange.base" /> -->

        <AppIconViewer />
      </UMain>
    </UContainer>
  </UApp>
</template>

<style scoped>
.main > * + *,
.picker > * + * {
  margin-block-start: 1rem;
}
</style>
