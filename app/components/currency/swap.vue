<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <UButton icon="ion:swap-horizontal" @click="exchange.swap()">
    swap
  </UButton>
</template>
