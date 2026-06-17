<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <header>
    <h1>FX Checker</h1>
    <div>
      {{ exchange.numCurrencies }} Currencies · EOD · {{ exchange.provider }} data
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
