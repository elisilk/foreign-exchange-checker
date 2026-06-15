<script setup lang="ts">
type Rate = {
  date: string;
  base: string;
  rate: number;
  quote: string;
};

const { status, data } = useFetch<Rate>(
  "https://api.frankfurter.dev/v2/rate/EUR/USD",
  {
    lazy: true,
  },
);

const rate = computed<number | undefined>(() => {
  if (!data.value)
    return undefined;
  return data.value.rate;
});

const send = ref<number | undefined>(undefined);
const receive = computed<number | undefined>({
  get() {
    return rate.value && send.value != null ? send.value * rate.value : undefined;
  },
  set(newValue) {
    send.value = rate.value && newValue != null ? newValue / rate.value : undefined;
  },
});
</script>

<template>
  <div>
    <header>
      <h1>FX Checker</h1>
    </header>

    <main>
      <div v-if="status === 'pending'">
        Loading ...
      </div>
      <div v-else-if="status === 'success' && data">
        <form>
          <h2>Check the Rate</h2>

          <label>
            <span>Send</span>
            <input
              id="send"
              v-model="send"
              type="number"
              name="send"
              placeholder="0"
              step="0.01"
            >
            <span>EUR</span>
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
            <span>USD</span>
          </label>
        </form>

        <p>1 {{ data.base }} = {{ data.rate }} {{ data.quote }}</p>
      </div>
    </main>
  </div>
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
