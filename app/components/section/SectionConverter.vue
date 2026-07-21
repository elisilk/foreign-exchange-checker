<script setup lang="ts">
const exchange = useExchangeStore();

function handleSendInput(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target) {
    exchange.setSendAmount(target.value);
  }
}

function handleReceiveInput(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target) {
    exchange.setReceiveAmount(target.value);
  }
}

const activeField = ref<"send" | "receive" | null>(null);

const sendAmountLocal = computed<string>({
  get: () => {
    if (activeField.value === "send") {
      return exchange.sendAmount;
    }
    return formatWithCommas(exchange.sendAmount);
  },
  set: (val) => {
    exchange.setSendAmount(parseCleanFloat(val));
  },
});

const receiveAmountLocal = computed<string>({
  get: () => {
    if (activeField.value === "receive") {
      return exchange.receiveAmount;
    }
    return formatWithCommas(exchange.receiveAmount);
  },
  set: (val) => {
    exchange.setReceiveAmount(parseCleanFloat(val));
  },
});

function formatWithCommas(num: string): string {
  const numericValue = Number.parseFloat(num);
  return Number.isInteger(numericValue) ? integerFormatter.format(numericValue) : decimalFormatter.format(numericValue);
}

function parseCleanFloat(str: string): string {
  return str.replace(/,/g, "");
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
    exchange.setSendAmount("");
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

const announcerText = computed(() => `${exchange.sendAmount} ${exchange.sendCurrency} can be exchanged for ${exchange.receiveAmount} ${exchange.receiveCurrency}.`);

const sendInputComponentRef = useTemplateRef("send-input");
const receiveInputComponentRef = useTemplateRef("receive-input");

onMounted(() => {
  if (sendInputComponentRef.value) {
    const nativeInput = sendInputComponentRef.value.inputRef;
    if (nativeInput) {
      exchange.registerSendInput(nativeInput);
    }
  }
  if (receiveInputComponentRef.value) {
    const nativeInput = receiveInputComponentRef.value.inputRef;
    if (nativeInput) {
      exchange.registerReceiveInput(nativeInput);
    }
  }
});
</script>

<template>
  <UForm
    class="space-y-4"
    aria-labelledby="converter-component-heading"
    novalidate
    @submit.prevent
  >
    <h2 id="converter-component-heading" class="uppercase text-3xl text-highlighted">
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
        <div class="bg-elevated rounded-2xl border border-muted p-4 md:p-5 flex gap-4 items-end justify-between overflow-scroll">
          <UTooltip
            :text="`${APP_SHORTCUTS.focusSendInput.label}`"
            :kbds="APP_SHORTCUTS.focusSendInput.kbds"
          >
            <UFormField
              label="Send"
              name="send"
            >
              <UInput
                ref="send-input"
                v-model="sendAmountLocal"
                name="send"
                size="xl"
                variant="ghost"
                color="neutral"
                type="text"
                inputmode="decimal"
                placeholder="0"
                :disabled="!exchange.rate"
                @input="handleSendInput"
                @focus="handleFocus($event, 'send')"
                @blur="handleBlur"
                @beforeinput="validateKey"
                @paste="handlePaste"
              />
            </UFormField>
          </UTooltip>

          <SectionConverterCurrencyPicker
            id="send-currency"
            v-model="exchange.sendCurrency"
          />
        </div>

        <ButtonSwapCurrencies class="justify-self-center self-center" />

        <!-- RECEIVE Input Group -->
        <div class="bg-elevated rounded-2xl border border-muted p-4 md:p-5 flex gap-4 items-end justify-between overflow-scroll">
          <UTooltip
            :text="`${APP_SHORTCUTS.focusReceiveInput.label}`"
            :kbds="APP_SHORTCUTS.focusReceiveInput.kbds"
          >
            <UFormField
              label="Receive"
              name="receive"
            >
              <UInput
                ref="receive-input"
                v-model="receiveAmountLocal"
                name="receive"
                size="xl"
                variant="ghost"
                color="primary"
                type="text"
                inputmode="decimal"
                :placeholder="exchange.rate ? '0' : 'Loading rate...'"
                :disabled="!exchange.rate"
                @input="handleReceiveInput"
                @focus="handleFocus($event, 'receive')"
                @blur="handleBlur"
                @beforeinput="validateKey"
                @paste="handlePaste"
              />
            </UFormField>
          </UTooltip>

          <SectionConverterCurrencyPicker
            id="receive-currency"
            v-model="exchange.receiveCurrency"
          />
        </div>
      </div>

      <template #footer>
        <!-- FOOTER inner container -->
        <div class="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <SectionConverterExchangeRate class="text-highlighted text-xs md:text-sm" />

          <!-- Form Actions Group -->
          <div class="form-actions flex gap-2">
            <ButtonToggleFavorite :pair="{ base: exchange.sendCurrency, quote: exchange.receiveCurrency }" variant="icon-plus-label" />
            <ButtonLogConversion />
            <ButtonShareLink />
          </div>
        </div>
      </template>
    </UCard>
  </UForm>
</template>
