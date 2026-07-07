<script setup lang="ts">
type Props = {
  log: Conversion;
};

const { log } = defineProps<Props>();

const exchange = useExchangeStore();

function deleteLog() {
  exchange.deleteConversionLog(log.datetime);
}
</script>

<template>
  <UButton
    aria-label="Delete log item"
    color="neutral"
    variant="subtle"
    class="group relative overflow-hidden"
    size="sm"
    square
    @click="deleteLog"
  >
    <UIcon
      name="ion:trash-outline"
      class="shrink-0 size-3 inline-block group-hover:hidden transition-all"
    />
    <UIcon
      name="ion:trash"
      class="hidden shrink-0 size-3 group-hover:inline-block transition-all"
    />
  </UButton>
</template>
