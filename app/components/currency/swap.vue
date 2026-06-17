<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <button @click="exchange.swap()">
    swap
  </button>
</template>
