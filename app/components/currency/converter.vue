<script setup lang="ts">
const exchange = useExchangeStore();

const receive = computed<number | undefined>({
  get() {
    return exchange.rate && exchange.amount != null ? exchange.amount * exchange.rate : undefined;
  },
  set(newValue) {
    exchange.amount = exchange.rate && newValue != null ? newValue / exchange.rate : undefined;
  },
});

const baseCountry = computed(() => {
  const countries = currencyToCountryMap[exchange.base];
  return countries && countries.length > 0
    ? countries[0]
    : undefined;
});

const quoteCountry = computed(() => {
  const countries = currencyToCountryMap[exchange.quote];
  return countries && countries.length > 0
    ? countries[0]
    : undefined;
});

function handleSubmit() {}
</script>

<template>
  <form
    class="converter-component"
    aria-labelledby="converter-component-heading"
    @submit.prevent="handleSubmit"
  >
    <h2 id="converter-component-heading">
      Check the Rate
    </h2>

    <label>
      <span>Send</span>
      <input
        id="send"
        v-model="exchange.amount"
        type="number"
        name="send"
        placeholder="0"
        step="0.01"
      >
      <span>{{ exchange.base }}</span>
      <img
        v-if="baseCountry"
        :src="`/flags/${baseCountry.toLowerCase()}.webp`"
        :alt="baseCountry"
      >
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
      <span>{{ exchange.quote }}</span>
      <img
        v-if="quoteCountry"
        :src="`/flags/${quoteCountry.toLowerCase()}.webp`"
        :alt="quoteCountry"
      >
    </label>

    <button :disabled="exchange.rate === undefined || exchange.amount === undefined || receive === undefined" @click="exchange.addConversionLog(exchange.base, exchange.quote, exchange.rate, exchange.amount, receive)">
      Log Conversion
    </button>

    <button type="submit">
      Submit
    </button>
  </form>
</template>

<style scoped>
form {
  display: grid;
  gap: 1rem;
  justify-items: start;
}

label {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

label img {
  block-size: 25px;
  inline-size: auto;
}

button[type="submit"] {
  display: none;
}
</style>
