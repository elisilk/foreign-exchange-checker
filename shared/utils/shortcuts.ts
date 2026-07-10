export const APP_SHORTCUTS = {
  focusSendInput: {
    kbds: ["ctrl", "s"],
    label: "Send",
    description: "Focus the send input",
  },
  focusReceiveInput: {
    kbds: ["ctrl", "r"],
    label: "Receive",
    description: "Focus the receive input",
  },
  swapCurrencyPair: {
    kbds: ["ctrl", "x"],
    label: "Swap",
    description: "Swap current currency pair",
  },
  toggleFavorite: {
    kbds: ["ctrl", "f"],
    label: "Favorite this pair",
    description: "Favorite/unfavorite current currency pair",
  },
  logConversion: {
    kbds: ["ctrl", "l"],
    label: "Log the conversion",
    description: "Log current conversion",
  },
  copyLink: {
    kbds: ["ctrl", "c"],
    label: "Copy shareable link",
    description: "Copy shareable link",
  },
  cycleTabsForward: {
    kbds: ["shift", "ctrl", "arrowright"],
    label: "Cycle through Tabs",
    description: "Cycle through content tabs (forward)",
  },
  cycleTabsBackward: {
    kbds: ["shift", "ctrl", "arrowleft"],
    label: "Cycle through Tabs",
    description: "Cycle through content tabs (backward)",
  },
  cycleHistoryTimeScaleForward: {
    kbds: ["ctrl", "t"],
    label: "Cycle through Time Scales",
    description: "Cycle through history time scales (forward)",
  },
  cycleHistoryTimeScaleBackward: {
    kbds: ["shift", "ctrl", "t"],
    label: "Cycle through Time Scales",
    description: "Cycle through history time scales (backward)",
  },
  toggleColorMode: {
    kbds: ["ctrl", "m"],
    label: "Color Mode",
    description: "Switch color modes",
  },
  toggleHelpModal: {
    kbds: ["ctrl", "/"],
    label: "Help",
    description: "Open/close this help window",
  },
};

export const joinKeys = (shortcutArray: string[]) => shortcutArray.join("_");

export const parseKeys = (shortcutString: string) => shortcutString.split("_");

export const keyMap: Record<string, string> = {
  meta: "⌘",
  ctrl: "Ctrl",
  shift: "Shift",
  alt: "Alt",
};

export const displayKey = (k: string) => keyMap[k] || k;
