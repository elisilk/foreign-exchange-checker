<script setup lang="ts">
type Props = {
  log: Conversion;
};

const { log } = defineProps<Props>();

const exchange = useExchangeStore();

function handleItemClick() {
  exchange.base = log.base;
  exchange.quote = log.quote;
  exchange.amount = log.send;
  scrollToTop();
}
</script>

<template>
  <section
    :aria-label="`Conversion log for pair: ${log.base} to ${log.quote} at ${log.datetime}`"
    class="relative flex items-center gap-4 py-3 px-4 border border-muted rounded-lg bg-elevated has-[.item-data:hover]:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:outline-none"
  >
    <button class="item-data flex-1 min-w-0 bg-transparent border-none cursor-pointer p-0 rounded-lg flex items-center justify-between gap-4 focus:outline-none after:absolute after:inset-0" @click="handleItemClick">
      <div class="flex text-start items-center flex-wrap gap-y-1 gap-x-4">
        <SectionLogTime class="text-lg w-16" :datetime="log.datetime" />

        <div class="flex items-center gap-2 text-lg text-highlighted">
          <span>{{ log.base }}</span>
          <UIcon name="ion:arrow-forward" class="size-3 text-default" />
          <span>{{ log.quote }}</span>
        </div>
      </div>

      <div class="flex justify-end items-center flex-wrap gap-y-0.5 gap-x-5">
        <span class="text-xl text-default">{{ decimalFormatter.format(log.send) }}</span>
        <span class="text-xl text-primary">{{ decimalFormatter.format(log.receive) }}</span>
      </div>
    </button>

    <ButtonDeleteLog :log />
  </section>
</template>
