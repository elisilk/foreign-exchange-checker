<script setup lang="ts">
const exchange = useExchangeStore();

const conversionLogSorted = computed<Conversion[]>(() => [...exchange.conversionLog].sort((a, b) => b.datetime > a.datetime ? 1 : -1));
</script>

<template>
  <section class="log-component" aria-label="Log">
    <template v-if="exchange.conversionLog.length === 0 ">
      <AppTabEmpty class="max-w-185">
        <template #heading>
          No conversions logged yet
        </template>
        Every conversion is recorded here automatically when you tap <span>LOG CONVERSION</span>. Your log is private to this session and this browser.
      </AppTabEmpty>
    </template>

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
