<script setup lang="ts">
const currency = useCurrencyStore();
</script>

<template>
  <div v-if="!currency.rate">
    No rate available
  </div>
  <div v-else>
    1 {{ currency.base }} = {{ currency.rate }} {{ currency.quote }}
  </div>
</template>
