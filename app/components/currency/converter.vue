<script setup lang="ts">
const exchange = useExchangeStore();

const activeField = ref<"send" | "receive" | null>(null);

const send = computed<string>({
  get: () => {
    if (exchange.amount === undefined || exchange.amount === null)
      return "";
    if (activeField.value === "send") {
      return Number.isInteger(exchange.amount)
        ? exchange.amount.toString()
        : exchange.amount.toFixed(2);
    }
    return formatWithCommas(exchange.amount);
  },
  set: (val) => {
    exchange.amount = val === "" ? undefined : parseCleanFloat(val);
  },
});

const receive = computed<string>({
  get: () => {
    if (!exchange.rate || exchange.amount === null || exchange.amount === undefined)
      return "";
    const rawReceive = exchange.amount * exchange.rate;

    if (activeField.value === "receive") {
      return Number.isInteger(rawReceive)
        ? rawReceive.toString()
        : rawReceive.toFixed(2);
    }
    return formatWithCommas(rawReceive);
  },
  set: (val) => {
    if (val === "" || !exchange.rate || exchange.rate === 0) {
      exchange.amount = undefined;
      return;
    }
    const cleanNum = parseCleanFloat(val);
    exchange.amount = cleanNum !== undefined ? cleanNum / exchange.rate : undefined;
  },
});

// Validation States
const isSendInvalid = computed(() => exchange.amount !== undefined && exchange.amount !== null && exchange.amount < 0);
const isReceiveInvalid = computed(() => {
  if (!exchange.rate || exchange.amount === undefined || exchange.amount === null)
    return false;
  return (exchange.amount * exchange.rate) < 0;
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

function handleSubmit() { }

const intFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const decFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function formatWithCommas(num: number | null | undefined): string {
  if (num === null || num === undefined || Number.isNaN(num))
    return "";

  return Number.isInteger(num) ? intFormatter.format(num) : decFormatter.format(num);
}

function parseCleanFloat(str: string): number | undefined {
  const clean = str.replace(/,/g, "");
  const parsed = Number.parseFloat(clean);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function checkClearance(event: Event): void {
  const target = event.target as HTMLInputElement;
  if (target.value === "") {
    exchange.amount = undefined;
  }
}

function validateKey(event: InputEvent): void {
  const target = event.target as HTMLInputElement;
  const cleanCurrent = target.value.replace(/,/g, "");

  if (event.data === "-") {
    event.preventDefault();
    return;
  }

  const start = target.selectionStart ?? 0;
  const end = target.selectionEnd ?? 0;
  const typedChar = event.data ?? "";

  const nextValue = cleanCurrent.slice(0, start) + typedChar + cleanCurrent.slice(end);

  const validPattern = /^\d*\.?\d{0,2}$/;
  if (event.data && event.data !== "." && !validPattern.test(nextValue)) {
    event.preventDefault();
  }
}

function handlePaste(event: ClipboardEvent): void {
  event.preventDefault();
  const target = event.target as HTMLInputElement;
  const pastedText = event.clipboardData?.getData("text") ?? "";

  const cleanNumbers = pastedText.replace(/[^0-9.]/g, "");
  const parsedValue = Number.parseFloat(cleanNumbers);

  if (!Number.isNaN(parsedValue) && parsedValue >= 0) {
    target.value = parsedValue.toFixed(2);
    target.dispatchEvent(new Event("input"));
  }
  else if (cleanNumbers === "") {
    target.value = "";
    exchange.amount = undefined;
    target.dispatchEvent(new Event("input"));
  }
}

function handleFocus(event: FocusEvent, field: "send" | "receive"): void {
  activeField.value = field;

  const target = event.target as HTMLInputElement;

  setTimeout(() => {
    if (target.value !== "" && target.value !== "0") {
      target.select();
    }
  }, 0);
}

function handleBlur(): void {
  activeField.value = null;
}
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

    <!-- SEND Input Group -->
    <div class="input-group" :class="{ 'is-invalid': isSendInvalid }">
      <label for="send">Send</label>
      <input
        id="send"
        v-model="send"
        name="send"
        type="text"
        inputmode="decimal"
        step="0.01"
        min="0"
        placeholder="0"
        :disabled="!exchange.rate"
        @focus="handleFocus($event, 'send')"
        @blur="handleBlur"
        @beforeinput="validateKey"
        @paste="handlePaste"
        @input="checkClearance"
      >
      <span>{{ exchange.base }}</span>
      <img
        v-if="baseCountry"
        :src="`/flags/${baseCountry.toLowerCase()}.webp`"
        :alt="baseCountry"
      >
      <span v-if="isSendInvalid" class="error-msg">Please enter a valid positive number</span>
    </div>

    <!-- RECEIVE Input Group -->
    <div class="input-group" :class="{ 'is-invalid': isReceiveInvalid }">
      <label for="receive">Receive</label>
      <input
        id="receive"
        v-model="receive"
        name="receive"
        type="text"
        inputmode="decimal"
        step="0.01"
        min="0"
        :placeholder="exchange.rate ? '0' : 'Loading rate...'"
        :disabled="!exchange.rate"
        @focus="handleFocus($event, 'receive')"
        @blur="handleBlur"
        @beforeinput="validateKey"
        @paste="handlePaste"
        @input="checkClearance"
      >
      <span>{{ exchange.quote }}</span>
      <img
        v-if="quoteCountry"
        :src="`/flags/${quoteCountry.toLowerCase()}.webp`"
        :alt="quoteCountry"
      >
    </div>

    <button :disabled="exchange.rate === undefined || exchange.amount === undefined || receive === ''" @click="exchange.addConversionLog(exchange.base, exchange.quote, exchange.rate, exchange.amount, Number(parseFloat(receive).toFixed(2)))">
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

.input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.input-group img {
  block-size: 25px;
  inline-size: auto;
}

button[type="submit"] {
  display: none;
}

.input-group.is-invalid input {
  border-color: #dc3545;
  background-color: #fff8f8;
}

.error-msg {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}
</style>
