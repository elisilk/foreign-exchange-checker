<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <UTooltip
    :text="`${APP_SHORTCUTS.swapCurrencyPair.label}`"
    :kbds="APP_SHORTCUTS.swapCurrencyPair.kbds"
  >
    <UButton
      variant="subtle"
      color="neutral"
      size="md"
      square
      aria-label="Swap"
      @click="exchange.swapCurrencies()"
    >
      <template #leading>
        <UIcon name="ion:swap-vertical" class="text-highlighted shrink-0 size-5 md:hidden" />
        <UIcon name="ion:swap-horizontal" class="text-highlighted shrink-0 size-5 hidden md:inline-block" />
      </template>
    </UButton>
  </UTooltip>
</template>
