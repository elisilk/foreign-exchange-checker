<script setup lang="ts">
type Props = {
  rate: Rate;
};

const { rate } = defineProps<Props>();

const exchange = useExchangeStore();

function getCurrencyName(isoCode: string): string | undefined {
  const currency = currencyMeta[isoCode];
  if (!currency)
    return undefined;
  return currency.name;
}

function getExchangeAmount(pair: Rate, amount: number): string {
  if (pair.rate === undefined)
    return "Error";
  return decimalFormatter.format(amount * pair.rate);
}

function handleItemClick() {
  exchange.quote = rate.quote;
}
</script>

<template>
  <section
    :aria-label="`Comparison rate for pair: ${rate.base} to ${rate.quote}`"
    class="relative flex items-center gap-4 py-3 px-4 border border-neutral-500 rounded-lg bg-neutral-600 has-[.item-data:hover]:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:outline-none"
  >
    <button class="item-data flex-1 min-w-0 bg-transparent border-none cursor-pointer p-0 rounded-lg text-start flex items-center gap-4 focus:outline-none after:absolute after:inset-0" @click="handleItemClick">
      <UIcon
        :name="currencyMeta[rate.quote]?.flagIcon"
        class="flag size-6 shrink-0"
      />

      <div class="grid gap-1.5 justify-items-start">
        <span class="text-lg text-neutral-50 min-w-0">{{ rate.quote }}</span>
        <span class="text-sm text-neutral-200">{{ getCurrencyName(rate.quote) }}</span>
      </div>

      <div class="ms-auto grid gap-1.5 justify-items-end min-w-0">
        <span class="text-xl text-neutral-50 truncate">{{ exchange.amount ? getExchangeAmount(rate, exchange.amount) : 'Error' }}</span>
        <span class="text-xs text-neutral-200">@ {{ rate.rate }}</span>
      </div>
    </button>

    <ButtonToggleFavorite
      :pair="{
        base: rate.base,
        quote: rate.quote,
      }"
    />
  </section>
</template>
