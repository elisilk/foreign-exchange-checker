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

const announcerText = computed(() => `${send.value} ${exchange.base} equals ${receive.value} ${exchange.quote}.`);
</script>

<template>
  <UForm
    class="space-y-4"
    aria-labelledby="converter-component-heading"
    @submit.prevent="handleSubmit"
  >
    <h2 id="converter-component-heading" class="uppercase text-3xl text-neutral-50">
      Check the Rate
    </h2>

    <UCard variant="subtle">
      <div
        id="converter-announcer"
        class="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {{ announcerText }}
      </div>

      <!-- BODY inner container -->
      <div class="grid gap-4 md:gap-6 md:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)]">
        <!-- SEND Input Group -->
        <div class="bg-neutral-600 rounded-2xl border border-neutral-500 p-4 md:p-5 flex gap-4 items-end justify-between overflow-scroll">
          <UFormField
            label="Send"
            name="send"
            :class="{ 'is-invalid': isSendInvalid }"
          >
            <UInput
              v-model="send"
              name="send"
              size="xl"
              variant="ghost"
              color="neutral"
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
            />
          </UFormField>

          <span v-if="isSendInvalid" class="error-msg">Please enter a valid positive number</span>

          <CurrencyPicker
            id="base"
            v-model="exchange.base"
          />
        </div>

        <CurrencySwap class="justify-self-center self-center" />

        <!-- RECEIVE Input Group -->
        <div class="bg-neutral-600 rounded-2xl border border-neutral-500 p-4 md:p-5 flex gap-4 items-end justify-between overflow-scroll">
          <UFormField
            label="Receive"
            name="receive"
            :class="{ 'is-invalid': isReceiveInvalid }"
          >
            <UInput
              v-model="receive"
              name="receive"
              size="xl"
              variant="ghost"
              color="primary"
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
            />
          </UFormField>

          <CurrencyPicker
            id="quote"
            v-model="exchange.quote"
          />
        </div>
      </div>

      <template #footer>
        <!-- FOOTER inner container -->
        <div class="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <CurrencyRate class="text-neutral-50 text-xs md:text-sm" />

          <!-- Form Actions Group -->
          <div class="form-actions flex gap-2">
            <UButton
              v-if="exchange.doesFavoriteExist(exchange.base, exchange.quote)"
              label="Favorited"
              class="h-8 w-29.25"
              icon="ion:star"
              @click="exchange.deleteFavorite(exchange.base, exchange.quote)"
            />

            <UButton
              v-else
              label="Favorite"
              class="h-8 w-29.25"
              icon="ion:star-outline"
              variant="subtle"
              color="neutral"
              @click="exchange.addFavorite(exchange.base, exchange.quote)"
            />

            <BtnLogConversion :receive />
          </div>
        </div>
      </template>
    </UCard>
  </UForm>
</template>

<style scoped>
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
