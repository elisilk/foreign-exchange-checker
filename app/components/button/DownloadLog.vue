<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <UTooltip text="Download log as a CSV file">
    <UButton
      icon="ion:download-outline"
      aria-label="Download log"
      size="lg"
      color="neutral"
      variant="ghost"
      class="h-7.5"
      square
      @click="exchange.downloadConversionLog"
    />
  </UTooltip>
</template>
