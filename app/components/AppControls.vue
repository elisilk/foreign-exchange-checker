<script setup lang="ts">
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});

const exchange = useExchangeStore();

const timeScaleItems = computed(() => Object.keys(timeScaleOptions));
const numTimeScaleItems = computed(() => timeScaleItems.value.length);

function cycleHistoryTimeScale(direction: "forward" | "backward" = "forward") {
  const currentTimeScaleIndex = timeScaleItems.value.findIndex(item => item === exchange.historyTimeScale);

  let nextTimeScaleIndex = currentTimeScaleIndex + (direction === "forward" ? 1 : -1);

  if (nextTimeScaleIndex >= numTimeScaleItems.value)
    nextTimeScaleIndex = nextTimeScaleIndex % numTimeScaleItems.value;

  if (nextTimeScaleIndex < 0)
    nextTimeScaleIndex = numTimeScaleItems.value - 1;

  exchange.historyTimeScale = timeScaleItems.value[nextTimeScaleIndex] || "";
}

const isHelpModalOpen = ref(false);
const guardShortcut = (cb: () => void) => () => !isHelpModalOpen.value && cb();

const shortcutItems = ref([
  {
    key: "s",
    label: "Focus the send input",
    handler: guardShortcut(() => exchange.focusSendInput()),
    usingInput: true,
  },
  {
    key: "r",
    label: "Focus the receive input",
    handler: guardShortcut(() => exchange.focusReceiveInput()),
    usingInput: true,
  },
  {
    key: "x",
    label: "Swap current currency pair",
    handler: guardShortcut(() => exchange.swap()),
    usingInput: true,
  },
  {
    key: "f",
    label: "Favorite/unfavorite current currency pair",
    handler: guardShortcut(() => exchange.toggleFavorite()),
    usingInput: true,
  },
  {
    key: "t",
    label: "Cycle through history time scales (forward)",
    handler: guardShortcut(() => cycleHistoryTimeScale()),
    usingInput: true,
  },
  {
    key: "shift_t",
    label: "Cycle through history time scales (backward)",
    handler: guardShortcut(() => cycleHistoryTimeScale("backward")),
    usingInput: true,
  },
  {
    key: "c",
    label: "Switch color modes",
    handler: () => isDark.value = !isDark.value,
    usingInput: true,
  },
  {
    key: "h",
    label: "Open/close this help window",
    handler: () => isHelpModalOpen.value = !isHelpModalOpen.value,
    usingInput: true,
  },
]);

type ShortcutItem
  = {
    handler: () => void;
    usingInput?: boolean | string;
  };

const shortcutMap: Record<string, ShortcutItem> = {};

shortcutItems.value.forEach((item) => {
  shortcutMap[item.key] = {
    handler: item.handler,
    usingInput: item.usingInput,
  };
});

defineShortcuts(shortcutMap);

const parseKeys = (shortcutString: string) => shortcutString.split("_");

const keyMap: Record<string, string> = {
  meta: "⌘",
  ctrl: "Ctrl",
  shift: "Shift",
  alt: "Alt",
};

const displayKey = (k: string) => keyMap[k] || k;
</script>

<template>
  <div class="flex items-center">
    <UTooltip text="Color Mode" :kbds="['c']">
      <UColorModeButton
        square
        size="lg"
        color="neutral"
        variant="ghost"
      />
    </UTooltip>

    <UModal
      v-model:open="isHelpModalOpen"
      title="FX Checker Help"
    >
      <UTooltip text="Help" :kbds="['h']">
        <UButton
          square
          size="lg"
          color="neutral"
          variant="ghost"
          icon="ion:help"
        />
      </UTooltip>

      <template #body>
        <div class="space-y-6">
          <div class="space-y-4">
            <h3 class="text-xl text-highlighted">
              About
            </h3>
            <p class="text-lg">
              FX Checker is a currency app built around live exchange rates. At its core, it converts an amount from one currency to another using real, up-to-date rates from an API.
            </p>
          </div>

          <div class="space-y-4">
            <h3 class="text-xl text-highlighted">
              Keyboard Shortcuts
            </h3>
            <ul class="space-y-2">
              <li
                v-for="item in shortcutItems"
                :key="item.key"
                class="flex items-center justify-between gap-4 py-2 px-2 border border-muted rounded-lg bg-elevated"
              >
                <div class="text-pretty text-xs">
                  {{ item.label }}
                </div>

                <div class="flex items-center gap-2">
                  <template v-for="(singleKey, index) in parseKeys(item.key)" :key="index">
                    <span v-if="index > 0">+</span>
                    <UKbd
                      size="md"
                      variant="outline"
                      color="primary"
                    >
                      {{ displayKey(singleKey) }}
                    </UKbd>
                  </template>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
