<script setup lang="ts">
const currency = useCurrencyStore();
</script>

<template>
  <button @click="currency.swap()">
    swap
  </button>
</template>
