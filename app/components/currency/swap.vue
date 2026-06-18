<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <button @click="exchange.swap()">
    <img src="/icon-exchange.svg" alt="">
    swap
  </button>
</template>
