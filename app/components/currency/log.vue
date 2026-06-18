<script setup lang="ts">
const exchange = useExchangeStore();
</script>

<template>
  <section class="log-component" aria-labelledby="log-component-heading">
    <h2 id="Log-component-heading">
      Log
    </h2>

    <template v-if="exchange.conversionLog.length === 0 ">
      <h3>No conversions logged yet</h3>
      <p>Every conversion is recorded here automatically when you tap Log conversion. Your log is private to this session and this browser.</p>
    </template>

    <template v-else>
      <header class="log-header">
        <div class="heading">
          Conversion Log
        </div>
        <div class="num-logs">
          {{ exchange.conversionLog.length }} logged
        </div>
      </header>

      <div class="log-list">
        <div
          v-for="log in exchange.conversionLog"
          :key="`log-${log.base}-${log.quote}`"
          class="log-item"
        >
          <span class="timestamp">({{ log.timestamp }})</span>
          <span class="base-iso-code">{{ log.base }}</span>
          <img src="/icon-arrow-right.svg" alt="arrow">
          <span class="quote-iso-code">{{ log.quote }}</span>
          <span class="send">{{ log.send }}</span>
          <span class="receive">{{ log.receive }}</span>

          <button @click="exchange.deleteConversionLog(log.timestamp)">
            <img src="/icon-delete.svg" alt="">
            Delete
          </button>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.log-component > * + * {
  margin-block-start: 1rem;
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
