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
        <ButtonDownloadLog />
        <ButtonClearAllLogs />
      </template>

      <TransitionGroup
        name="list"
        tag="ul"
        class="space-y-4"
      >
        <SectionLogItem
          v-for="log in conversionLogSorted"
          :key="`log-item-${log.base}-${log.quote}-${log.datetime}`"
          :log
        />
      </TransitionGroup>
    </UCard>
  </section>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
