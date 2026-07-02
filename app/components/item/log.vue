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
}
</script>

<template>
  <section
    :aria-label="`Conversion log for pair: ${log.base} to ${log.quote} at ${log.datetime}`"
    class="relative flex items-center gap-4 py-3 px-4 border border-muted rounded-lg bg-elevated has-[.item-data:hover]:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:outline-none"
  >
    <button class="item-data item-data flex-1 min-w-0 bg-transparent border-none cursor-pointer p-0 rounded-lg flex items-center gap-4 focus:outline-none after:absolute after:inset-0" @click="handleItemClick">
      <CurrencyTime class="text-lg" :datetime="log.datetime" />

      <div class="flex items-center gap-2 text-lg text-highlighted">
        <span>{{ log.base }}</span>
        <UIcon name="ion:arrow-forward" class="size-3" />
        <span>{{ log.quote }}</span>
      </div>

      <div class="ms-auto grid gap-1.5 justify-items-end">
        <span class="text-xl text-default">{{ decimalFormatter.format(log.send) }}</span>
        <span class="text-xl text-primary">{{ decimalFormatter.format(log.receive) }}</span>
      </div>
    </button>

    <ButtonDeleteLog :log />
  </section>
</template>
