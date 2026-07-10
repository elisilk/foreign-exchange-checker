<script setup lang="ts">
const exchange = useExchangeStore();
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});

const isHelpModalOpen = ref(false);
const guardShortcut = (cb: () => void) => () => !isHelpModalOpen.value && cb();

const shortcutItems = ref({
  [joinKeys(APP_SHORTCUTS.focusSendInput.kbds)]: {
    handler: guardShortcut(() => exchange.focusSendInput()),
    usingInput: true,
  },
  [joinKeys(APP_SHORTCUTS.focusReceiveInput.kbds)]: {
    handler: guardShortcut(() => exchange.focusReceiveInput()),
    usingInput: true,
  },
  [joinKeys(APP_SHORTCUTS.swapCurrencyPair.kbds)]: {
    handler: guardShortcut(() => exchange.swap()),
    usingInput: true,
  },
  [joinKeys(APP_SHORTCUTS.toggleFavorite.kbds)]: {
    handler: guardShortcut(() => exchange.toggleFavorite()),
    usingInput: true,
  },
  [joinKeys(APP_SHORTCUTS.logConversion.kbds)]: {
    handler: guardShortcut(() => exchange.logCurrentConversion()),
    usingInput: true,
  },
  [joinKeys(APP_SHORTCUTS.copyLink.kbds)]: {
    handler: guardShortcut(() => exchange.copyShareLink()),
    usingInput: true,
  },
  [joinKeys(APP_SHORTCUTS.cycleTabsForward.kbds)]: {
    handler: guardShortcut(() => exchange.cycleTabs()),
    usingInput: true,
  },
  [joinKeys(APP_SHORTCUTS.cycleTabsBackward.kbds)]: {
    handler: guardShortcut(() => exchange.cycleTabs("backward")),
    usingInput: true,
  },
  [joinKeys(APP_SHORTCUTS.cycleHistoryTimeScaleForward.kbds)]: {
    handler: guardShortcut(() => exchange.cycleHistoryTimeScale()),
    usingInput: true,
  },
  [joinKeys(APP_SHORTCUTS.cycleHistoryTimeScaleBackward.kbds)]: {
    handler: guardShortcut(() => exchange.cycleHistoryTimeScale("backward")),
    usingInput: true,
  },
  [joinKeys(APP_SHORTCUTS.toggleColorMode.kbds)]: {
    handler: () => isDark.value = !isDark.value,
    usingInput: true,
  },
  [joinKeys(APP_SHORTCUTS.toggleHelpModal.kbds)]: {
    handler: () => isHelpModalOpen.value = !isHelpModalOpen.value,
    usingInput: true,
  },
});

defineShortcuts(shortcutItems);

const shortcutItemsArray = computed(
  () =>
    Object.entries(APP_SHORTCUTS).map(
      ([key, values]) =>
        ({
          key,
          ...values,
        }),
    ),
);
</script>

<template>
  <div class="flex items-center">
    <UTooltip
      :text="`${APP_SHORTCUTS.toggleColorMode.label}`"
      :kbds="APP_SHORTCUTS.toggleColorMode.kbds"
    >
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
      <UTooltip
        :text="`${APP_SHORTCUTS.toggleHelpModal.label}`"
        :kbds="APP_SHORTCUTS.toggleHelpModal.kbds"
      >
        <UButton
          square
          size="lg"
          color="neutral"
          variant="ghost"
          icon="ion:help-circle-outline"
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
                v-for="item in shortcutItemsArray"
                :key="item.key"
                class="flex items-center justify-between gap-4 py-2 px-2 border border-muted rounded-lg bg-muted"
              >
                <div class="text-pretty text-xs">
                  {{ item.description }}
                </div>

                <div class="flex items-center gap-2">
                  <template v-for="(singleKey, index) in item.kbds" :key="index">
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
