<script setup lang="ts">
const exchange = useExchangeStore();

const conversionLogSorted = computed<Conversion[]>(() => [...exchange.conversionLog].sort((a, b) => b.datetime > a.datetime ? 1 : -1));

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
</script>

<template>
  <section class="log-component" aria-labelledby="log-component-heading">
    <h2 id="log-component-heading" class="component-heading">
      Log
      <span>{{ exchange.conversionLog.length }}</span>
    </h2>

    <template v-if="exchange.conversionLog.length === 0 ">
      <h3>No conversions logged yet</h3>
      <p>Every conversion is recorded here automatically when you tap <span>LOG CONVERSION</span>. Your log is private to this session and this browser.</p>
    </template>

    <template v-else>
      <header class="log-header">
        <div class="heading">
          Conversion Log
        </div>
        <div class="num-logs">
          <span>{{ exchange.conversionLog.length }} logged</span>
          <UButton @click="exchange.deleteAllConversionLogs">
            Clear All
          </UButton>
        </div>
      </header>

      <div class="log-list">
        <div
          v-for="log in conversionLogSorted"
          :key="`log-${log.base}-${log.quote}`"
          class="log-item"
        >
          <CurrencyTime :datetime="log.datetime" />
          <span class="base-iso-code">{{ log.base }}</span>
          <UIcon name="ion:arrow-forward" class="size-5" />
          <span class="quote-iso-code">{{ log.quote }}</span>
          <span class="send">{{ formatter.format(log.send) }}</span>
          <span class="receive">{{ formatter.format(log.receive) }}</span>

          <UButton icon="ion:trash-outline" @click="exchange.deleteConversionLog(log.datetime)">
            Delete
          </UButton>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.log-component > * + * {
  margin-block-start: 1rem;
}

.component-heading span {
  display: inline-grid;
  place-items: center;
  background: black;
  color: white;
  block-size: 2rem;
  inline-size: 2rem;
  border-radius: 50%;
}

.log-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1ch;
}

.log-list > * + * {
  margin-block-start: 1rem;
}

.log-item {
  display: flex;
  gap: 1ch;
}
</style>
