<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <UHeader>
    <template #title>
      <h1>FX Checker</h1>
    </template>

    <template #right>
      {{ exchange.numCurrencies }} Currencies · EOD · {{ exchange.provider }} data
    </template>
  </UHeader>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
