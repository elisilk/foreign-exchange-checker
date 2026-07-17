<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <div v-if="!exchange.rate">
    No rate available
  </div>
  <div v-else>
    1 {{ exchange.sendCurrency }} = {{ formatExchangeRate(exchange.rate) }} {{ exchange.receiveCurrency }}
  </div>
</template>
