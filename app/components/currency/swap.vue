<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <UButton
    square
    aria-label="Swap"
    @click="exchange.swap()"
  >
    <template #leading>
      <UIcon name="ion:swap-vertical" class="md:hidden" />
      <UIcon name="ion:swap-horizontal" class="hidden md:inline-block" />
    </template>
  </UButton>
</template>
