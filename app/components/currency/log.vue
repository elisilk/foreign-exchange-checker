<script setup lang="ts">
const exchange = useExchangeStore();

const conversionLogSorted = computed<Conversion[]>(() => [...exchange.conversionLog].sort((a, b) => b.datetime > a.datetime ? 1 : -1));

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
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
        <div
          v-for="log in conversionLogSorted"
          :key="`log-${log.base}-${log.quote}`"
          class="flex items-center gap-4 py-3 px-4 border border-neutral-500 rounded-lg bg-neutral-600"
        >
          <CurrencyTime class="text-lg text-neutral-200" :datetime="log.datetime" />

          <div class="flex items-center gap-2 text-lg text-neutral-50">
            <span>{{ log.base }}</span>
            <UIcon name="ion:arrow-forward" class="size-3 text-neutral-200" />
            <span>{{ log.quote }}</span>
          </div>

          <div class="ms-auto grid gap-1.5 justify-items-end">
            <span class="text-xl text-neutral-100">{{ formatter.format(log.send) }}</span>
            <span class="text-xl text-primary">{{ formatter.format(log.receive) }}</span>
          </div>

          <UButton
            aria-label="Delete log item"
            color="neutral"
            variant="subtle"
            class="group relative overflow-hidden"
            size="sm"
            square
            @click="exchange.deleteConversionLog(log.datetime)"
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
        </div>
      </div>
    </UCard>
  </section>
</template>
