<script setup lang="ts">
const { receive } = defineProps<Props>();

const exchange = useExchangeStore();

type Props = {
  receive: string;
};

const isLoading = ref(false);
const isSuccess = ref(false);

const defaultVariant = "outline";
const successVariant = "solid";

const defaultClasses = "text-neutral-50";
const successClasses = "text-inverted capitalize";

const defaultLabel = "Log Conversion";
const successLabel = "Logged";

const successTimeoutMs = 2000;

const currentVariant = computed(() => isSuccess.value ? successVariant : defaultVariant);
const currentClasses = computed(() => isSuccess.value ? successClasses : defaultClasses);
const currentLabel = computed(() => isSuccess.value ? successLabel : defaultLabel);

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
    :variant="currentVariant"
    :label="currentLabel"
    class="h-8 w-33 justify-center"
    :class="currentClasses"
    :disabled="isInvalid"
    @click="handleClick"
  />
</template>
