<script setup lang="ts">
type Props = {
  receive: string;
};

const { receive } = defineProps<Props>();

const exchange = useExchangeStore();

const isLoading = ref(false);
const isSuccess = ref(false);

const successTimeoutMs = 2000;

const isInvalid = computed(() => isLoading.value || exchange.rate === undefined || exchange.amount === undefined || receive === "");

async function handleClick() {
  isLoading.value = true;

  exchange.addConversionLog(exchange.base, exchange.quote, exchange.rate, exchange.amount, Number(Number.parseFloat(receive.replace(/,/g, "")).toFixed(2)));

  isSuccess.value = true;
  setTimeout(() => {
    isLoading.value = false;
    isSuccess.value = false;
  }, successTimeoutMs);
}
</script>

<template>
  <UButton
    :icon="isSuccess ? 'ion:checkmark' : undefined"
    :variant="isSuccess ? 'solid' : 'outline'"
    :label="isSuccess ? 'Logged' : 'Log Conversion'"
    class="h-8 w-33 justify-center"
    :class="isSuccess ? 'text-inverted capitalize' : 'text-highlighted'"
    :disabled="isInvalid"
    @click="handleClick"
  />
</template>
