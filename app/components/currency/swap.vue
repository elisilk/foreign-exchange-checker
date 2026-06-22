<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <UButton
    variant="subtle"
    color="neutral"
    size="md"
    square
    aria-label="Swap"
    @click="exchange.swap()"
  >
    <template #leading>
      <UIcon name="ion:swap-vertical" class="shrink-0 size-5 md:hidden" />
      <UIcon name="ion:swap-horizontal" class="shrink-0 size-5 hidden md:inline-block" />
    </template>
  </UButton>
</template>
