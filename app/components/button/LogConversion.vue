<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <UTooltip
    :text="`${APP_SHORTCUTS.logConversion.label}`"
    :kbds="APP_SHORTCUTS.logConversion.kbds"
  >
    <UButton
      :variant="exchange.isCurrentConversionLogging ? 'solid' : 'outline'"
      :label="exchange.isCurrentConversionLogging ? 'Logged' : 'Log Conversion'"
      :icon="exchange.isCurrentConversionLogging ? 'ion:checkmark' : 'ion:reader-outline'"
      :class="exchange.isCurrentConversionLogging ? 'text-inverted capitalize' : 'text-highlighted'"
      :disabled="!exchange.isConversionValid || exchange.isCurrentConversionLogging"
      :ui="{
        base: 'h-8 justify-center sm:w-40',
        label: 'hidden sm:inline-block',
      }"
      @click="exchange.logCurrentConversion"
    />
  </UTooltip>
</template>
