<script setup lang="ts">
const currency = useCurrencyStore();
</script>

<template>
  <header>
    <h1>FX Checker</h1>
    <div>
      {{ currency.numCurrencies }} Currencies · EOD · {{ currency.provider }} data
    </div>
  </header>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
