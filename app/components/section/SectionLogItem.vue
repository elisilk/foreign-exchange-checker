<script setup lang="ts">
type Props = {
  log: Conversion;
};

const { log } = defineProps<Props>();

const exchange = useExchangeStore();

function handleItemClick() {
  exchange.sendCurrency = log.sendCurrency;
  exchange.receiveCurrency = log.receiveCurrency;
  exchange.setSendAmount(log.sendAmount);
  scrollToTop();
}
</script>

<template>
  <li
    :aria-label="`Conversion log for pair: ${log.sendCurrency} to ${log.receiveCurrency} at ${log.datetime}`"
    class="relative flex items-center gap-4 py-3 px-4 border border-muted rounded-lg bg-elevated has-[.item-data:hover]:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:outline-none"
  >
    <button class="item-data flex-1 min-w-0 bg-transparent border-none cursor-pointer p-0 rounded-lg flex items-center justify-between gap-4 focus:outline-none after:absolute after:inset-0" @click="handleItemClick">
      <div class="flex text-start items-center flex-wrap gap-y-1 gap-x-4">
        <SectionLogTime class="text-lg w-16" :datetime="log.datetime" />

        <div class="flex items-center gap-2 text-lg text-highlighted">
          <span>{{ log.sendCurrency }}</span>
          <UIcon name="ion:arrow-forward" class="size-3 text-default" />
          <span>{{ log.receiveCurrency }}</span>
        </div>
      </div>

      <div class="flex justify-end items-center flex-wrap gap-y-0.5 gap-x-5">
        <span class="text-xl text-default">{{ formatCurrency(log.sendAmount, log.sendCurrency) }}</span>
        <span class="text-xl text-primary">{{ formatCurrency(log.receiveAmount, log.receiveCurrency) }}</span>
      </div>
    </button>

    <ButtonDeleteLog :log />
  </li>
</template>
