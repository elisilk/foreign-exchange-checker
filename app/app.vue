<script setup lang="ts">
const currency = useCurrencyStore();

const { status, data: currencies } = useFetch<Currency[]>(
  `https://api.frankfurter.dev/v2/currencies?providers=${currency.provider}`,
  {
    lazy: true,
  },
);

const numCurrencies = computed(() => currencies.value?.length ?? 0);
</script>

<template>
  <div>
    <AppHeader :provider="currency.provider" :num-currencies="numCurrencies" />

    <main>
      <div v-if="status === 'pending'">
        Loading ...
      </div>
      <div v-else-if="status === 'success' && currencies">
        <CurrencyPicker
          id="base"
          v-model="currency.base"
          :currencies
        />

        <CurrencyPicker
          id="quote"
          v-model="currency.quote"
          :currencies
        />

        <CurrencySwap
          v-model:base="currency.base"
          v-model:quote="currency.quote"
        />

        <CurrencyConverter :base="currency.base" :quote="currency.quote" />

        <CurrencyCompare />

        <CurrencyTicker :base="currency.base" />
      </div>
    </main>
  </div>
</template>
