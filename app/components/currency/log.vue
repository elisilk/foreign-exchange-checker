<script setup lang="ts">
const exchange = useExchangeStore();

const conversionLogSorted = computed<Conversion[]>(() => [...exchange.conversionLog].sort((a, b) => b.datetime > a.datetime ? 1 : -1));
</script>

<template>
  <section class="log-component" aria-label="Log">
    <UEmpty
      v-if="exchange.conversionLog.length === 0"
      title="No conversions logged yet"
      description="Every conversion is recorded here automatically when you tap LOG CONVERSION. Your log is private to this session and this browser."
    />

    <UCard
      v-else
      title="Conversion Log"
    >
      <template #description>
        <span>{{ exchange.conversionLog.length }} logged</span>
        <UButton
          label="Clear All"
          color="neutral"
          variant="subtle"
          class="h-7.5 w-23.25"
          @click="exchange.deleteAllConversionLogs"
        />
      </template>

      <div class="space-y-4">
        <ItemLog
          v-for="log in conversionLogSorted"
          :key="`log-item-${log.base}-${log.quote}`"
          :log
        />
      </div>
    </UCard>
  </section>
</template>
