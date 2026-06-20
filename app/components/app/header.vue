<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <UHeader :toggle="false">
    <template #title>
      <h1>
        <span class="sr-only">FX Checker</span>
        <img src="/logo.svg" alt="FX Checker logo">
      </h1>
    </template>

    <template #right>
      {{ exchange.numCurrencies }} Currencies · EOD · {{ exchange.provider }} data
    </template>
  </UHeader>
</template>
