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

    <UCard v-else title="Conversion Log">
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

      <div class="log-list">
        <div
          v-for="log in conversionLogSorted"
          :key="`log-${log.base}-${log.quote}`"
          class="log-item"
        >
          <CurrencyTime class="time" :datetime="log.datetime" />

          <div class="pair">
            <span class="base-iso-code">{{ log.base }}</span>
            <UIcon name="ion:arrow-forward" class="size-5" />
            <span class="quote-iso-code">{{ log.quote }}</span>
          </div>

          <div class="amounts">
            <span class="send">{{ formatter.format(log.send) }}</span>
            <span class="receive">{{ formatter.format(log.receive) }}</span>
          </div>

          <UButton
            aria-label="Delete log item"
            variant="subtle"
            color="neutral"
            class="group relative overflow-hidden"
            size="sm"
            square
            @click="exchange.deleteConversionLog(log.datetime)"
          >
            <UIcon
              name="ion:trash-outline"
              class="shrink-0 size-4 inline-block group-hover:hidden transition-all"
            />
            <UIcon
              name="ion:trash"
              class="hidden shrink-0 size-4 group-hover:inline-block transition-all"
            />
          </UButton>
        </div>
      </div>
    </UCard>
  </section>
</template>

<style scoped>
.log-list > * + * {
  margin-block-start: 1rem;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid grey;
  background: black;
}

.pair {
  display: flex;
  align-items: center;
  gap: 1ch;
}

.amounts {
  margin-inline-start: auto;
  display: grid;
  justify-items: end;
}
</style>
