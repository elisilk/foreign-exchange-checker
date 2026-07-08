<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <div v-if="!exchange.rate">
    No rate available
  </div>
  <div v-else>
    1 {{ exchange.base }} = {{ exchange.rate }} {{ exchange.quote }}
  </div>
</template>
