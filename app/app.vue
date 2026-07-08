<script setup lang="ts">
const exchange = useExchangeStore();

await useAsyncData("initRates", async () => {
  await exchange.fetchRates();
  return true;
});
</script>

<template>
  <UApp class="font-sans antialiased">
    <AppHeader />

    <UMain aria-labelledby="main-heading">
      <SectionTicker />

      <UContainer class="px-4 sm:px-4 md:px-6 py-8 md:py-12 space-y-10">
        <h1 id="main-heading" class="sr-only">
          Foreign Exchange Checker
        </h1>

        <SectionConverter />

        <AppTabs />
      </UContainer>
    </UMain>
  </UApp>
</template>
