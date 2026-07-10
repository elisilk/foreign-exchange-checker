<script setup lang="ts">
const exchange = useExchangeStore();

const activeField = ref<"send" | "receive" | null>(null);

const send = computed<string>({
  get: () => {
    if (exchange.send === undefined || exchange.send === null)
      return "";
    if (activeField.value === "send") {
      return Number.isInteger(exchange.send)
        ? exchange.send.toString()
        : exchange.send.toFixed(2);
    }
    return formatWithCommas(exchange.send);
  },
  set: (val) => {
    exchange.send = val === "" ? undefined : parseCleanFloat(val);
  },
});

const receive = computed<string>({
  get: () => {
    if (!exchange.isConversionValid || exchange.receive === undefined)
      return "";

    const rawReceive = exchange.receive;

    if (activeField.value === "receive") {
      return Number.isInteger(rawReceive)
        ? rawReceive.toString()
        : rawReceive.toFixed(2);
    }
    return formatWithCommas(rawReceive);
  },
  set: (val) => {
    if (val === "" || !exchange.rate || exchange.rate === 0) {
      exchange.send = undefined;
      return;
    }
    const cleanNum = parseCleanFloat(val);
    exchange.send = cleanNum !== undefined ? cleanNum / exchange.rate : undefined;
  },
});

// Validation States
const isSendInvalid = computed(() => exchange.send === undefined || exchange.send === null || exchange.send < 0);
const isReceiveInvalid = computed(() => exchange.send === undefined || exchange.send === null || !exchange.rate || ((exchange.send * exchange.rate) < 0));

function handleSubmit() { }

function formatWithCommas(num: number | null | undefined): string {
  if (num === null || num === undefined || Number.isNaN(num))
    return "";

  return Number.isInteger(num) ? integerFormatter.format(num) : decimalFormatter.format(num);
}

function parseCleanFloat(str: string): number | undefined {
  const clean = str.replace(/,/g, "");
  const parsed = Number.parseFloat(clean);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function checkClearance(event: Event): void {
  const target = event.target as HTMLInputElement;
  if (target.value === "") {
    exchange.send = undefined;
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
    exchange.send = undefined;
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

const sendInputComponentRef = useTemplateRef("send-input");
const receiveInputComponentRef = useTemplateRef("receive-input");

onMounted(() => {
  if (sendInputComponentRef.value) {
    const nativeInput = sendInputComponentRef.value.inputRef;
    if (nativeInput)
      exchange.registerSendInput(nativeInput);
  }
  if (receiveInputComponentRef.value) {
    const nativeInput = receiveInputComponentRef.value.inputRef;
    if (nativeInput)
      exchange.registerReceiveInput(nativeInput);
  }
});
</script>

<template>
  <UForm
    class="space-y-4"
    aria-labelledby="converter-component-heading"
    novalidate
    @submit.prevent="handleSubmit"
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
                :aria-invalid="isSendInvalid"
                :disabled="!exchange.rate"
                @focus="handleFocus($event, 'send')"
                @blur="handleBlur"
                @beforeinput="validateKey"
                @paste="handlePaste"
                @input="checkClearance"
              />
            </UFormField>
          </UTooltip>

          <SectionConverterCurrencyPicker
            id="base"
            v-model="exchange.base"
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
                v-model="receive"
                name="receive"
                size="xl"
                variant="ghost"
                color="primary"
                type="text"
                inputmode="decimal"
                step="0.01"
                min="0"
                :aria-invalid="isReceiveInvalid"
                :placeholder="exchange.rate ? '0' : 'Loading rate...'"
                :disabled="!exchange.rate"
                @focus="handleFocus($event, 'receive')"
                @blur="handleBlur"
                @beforeinput="validateKey"
                @paste="handlePaste"
                @input="checkClearance"
              />
            </UFormField>
          </UTooltip>

          <SectionConverterCurrencyPicker
            id="quote"
            v-model="exchange.quote"
          />
        </div>
      </div>

      <template #footer>
        <!-- FOOTER inner container -->
        <div class="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <SectionConverterExchangeRate class="text-highlighted text-xs md:text-sm" />

          <!-- Form Actions Group -->
          <div class="form-actions flex gap-2">
            <ButtonToggleFavorite :pair="{ base: exchange.base, quote: exchange.quote }" variant="icon-plus-label" />
            <ButtonLogConversion />
            <ButtonShareLink />
          </div>
        </div>
      </template>
    </UCard>
  </UForm>
</template>
