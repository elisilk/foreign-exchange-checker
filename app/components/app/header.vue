<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <UHeader :toggle="false">
    <template #title>
      <h1>
        <span class="sr-only">FX Checker</span>
        <img
          src="/logo.svg"
          alt="FX Checker logo"
          class="w-auto h-5 sm:h-6.5"
        >
      </h1>
    </template>

    <template #right>
      <div class="uppercase text-neutral-200 text-preset-6 sm:text-preset-4 text-right text-balance">
        {{ exchange.numCurrencies }} Currencies · EOD · {{ exchange.provider }} data
      </div>
    </template>
  </UHeader>
</template>
