<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <UHeader :toggle="false">
    <template #left>
      <h1>
        <span class="sr-only">FX Checker</span>
        <img
          src="/logo.svg"
          alt="FX Checker logo"
          class="w-auto h-5 md:h-6.5"
        >
      </h1>
    </template>

    <template #right>
      <div class="uppercase text-neutral-200 text-right text-balance text-xs md:text-lg">
        {{ exchange.availableCurrencies.length }} Currencies · EOD · {{ exchange.provider }} data
      </div>
    </template>
  </UHeader>
</template>
