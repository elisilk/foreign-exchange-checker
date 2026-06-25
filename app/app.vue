<script setup lang="ts">
const exchange = useExchangeStore();

await useAsyncData("initRates", async () => {
  await exchange.fetchCurrencies();
  await exchange.fetchRates();
  await exchange.fetchRatesYesterday();
  return true;
});
</script>

<template>
  <UApp class="font-sans antialiased">
    <AppHeader />

    <UMain aria-labelledby="main-heading">
      <!-- <CurrencyTicker :base="exchange.base" /> -->

      <UContainer class="space-y-4 py-4">
        <h1 id="main-heading" class="sr-only">
          Foreign Exchange Checker
        </h1>

        <CurrencyConverter />

        <!--
        <AppRateVerifier />
        <AppIconViewer />
        -->

        <AppTabs />
      </UContainer>
    </UMain>
  </UApp>
</template>
