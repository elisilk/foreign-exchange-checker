<script setup lang="ts">
const provider = ref("ECB");
const base = ref("USD");
const quote = ref("EUR");

const { status, data: currencies } = useFetch<Currency[]>(
  `https://api.frankfurter.dev/v2/currencies?providers=${provider.value}`,
  {
    lazy: true,
  },
);

const numCurrencies = computed(() => currencies.value?.length ?? 0);
</script>

<template>
  <div>
    <AppHeader :provider :num-currencies="numCurrencies" />

    <main>
      <div v-if="status === 'pending'">
        Loading ...
      </div>
      <div v-else-if="status === 'success' && currencies">
        <CurrencyPicker
          id="base"
          v-model="base"
          :currencies
        />

        <CurrencyPicker
          id="quote"
          v-model="quote"
          :currencies
        />

        <CurrencySwap
          v-model:base="base"
          v-model:quote="quote"
        />

        <CurrencyConverter :base :quote />
      </div>
    </main>
  </div>
</template>
