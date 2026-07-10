<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <UTooltip
    :text="`${APP_SHORTCUTS.copyLink.label}`"
    :kbds="APP_SHORTCUTS.copyLink.kbds"
  >
    <UButton
      :variant="exchange.isShareLinkCopied ? 'solid' : 'outline'"
      :label="exchange.isShareLinkCopied ? 'Link Copied!' : 'Copy Link'"
      :icon="exchange.isShareLinkCopied ? 'ion:checkmark' : 'ion:copy-outline'"
      :class="exchange.isShareLinkCopied ? 'text-inverted capitalize' : 'text-highlighted'"
      :disabled="exchange.isShareLinkCopied"
      :ui="{
        base: 'h-8 justify-center sm:w-34',
        label: 'hidden sm:inline-block',
      }"
      @click="exchange.copyShareLink"
    />
  </UTooltip>
</template>
