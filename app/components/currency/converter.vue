<script setup lang="ts">
const currency = useCurrencyStore();

const receive = computed<number | undefined>({
  get() {
    return currency.rate && currency.amount != null ? currency.amount * currency.rate : undefined;
  },
  set(newValue) {
    currency.amount = currency.rate && newValue != null ? newValue / currency.rate : undefined;
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
