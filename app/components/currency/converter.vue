<script setup lang="ts">
const currency = useCurrencyStore();

const { status, data } = useFetch<Rate>(
  () => `https://api.frankfurter.dev/v2/rate/${currency.base}/${currency.quote}`,
  {
    lazy: true,
  },
);

const rate = computed<number | undefined>(() => {
  if (!data.value)
    return undefined;
  return data.value.rate;
});

const receive = computed<number | undefined>({
  get() {
    return rate.value && currency.amount != null ? currency.amount * rate.value : undefined;
  },
  set(newValue) {
    currency.amount = rate.value && newValue != null ? newValue / rate.value : undefined;
  },
});
</script>

<template>
  <form>
    <h2>Check the Rate</h2>

    <label>
      <span>Send</span>
      <input
        id="send"
        v-model="currency.amount"
        type="number"
        name="send"
        placeholder="0"
        step="0.01"
      >
      <span>{{ currency.base }}</span>
    </label>

    <label>
      <span>Receive</span>
      <input
        id="receive"
        v-model="receive"
        type="number"
        name="receive"
        placeholder="0"
        step="0.01"
      >
      <span>{{ currency.quote }}</span>
    </label>

    <div v-if="status === 'pending'">
      Loading ...
    </div>

    <div v-else-if="status === 'success' && data">
      1 {{ data.base }} = {{ data.rate }} {{ data.quote }}
    </div>
  </form>
</template>

<style scoped>
form {
  display: grid;
  gap: 1rem;
}

label {
  display: flex;
  gap: 0.5rem;
}
</style>
