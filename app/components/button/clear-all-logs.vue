<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <UButton
    label="Clear All"
    color="neutral"
    variant="subtle"
    class="h-7.5 w-23.25"
    @click="exchange.deleteAllConversionLogs"
  />
</template>
