<script setup lang="ts">
type Props = {
  datetime: string | number | Date;
  cutoffHours?: number;
};

const { datetime, cutoffHours = 24 } = defineProps<Props>();

const isMounted = ref(false);
const now = ref(Date.now());
let timerTimeout: ReturnType<typeof setTimeout> | null = null;

const targetTimeMs = computed(() => new Date(datetime).getTime());

const diffInSeconds = computed(() => {
  return Math.floor((now.value - targetTimeMs.value) / 1000);
});

const isRecent = computed(() => {
  const cutoffInMs = cutoffHours * 60 * 60 * 1000;
  return Math.abs(now.value - targetTimeMs.value) < cutoffInMs;
});

const liveRelativeText = computed(() => {
  const seconds = diffInSeconds.value;

  if (seconds < 5)
    return "NOW";
  if (seconds < 60)
    return `${seconds}S`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)
    return `${minutes}M`;

  const hours = Math.floor(minutes / 60);
  return `${hours}H`;
});

function scheduleNextTick() {
  if (timerTimeout)
    clearTimeout(timerTimeout);

  now.value = Date.now();

  let delay = 30000; // Default: 30 seconds

  if (diffInSeconds.value < 60) {
    delay = 1000; // Fresh: 1 second loops
  }

  timerTimeout = setTimeout(scheduleNextTick, delay);
}

onMounted(() => {
  isMounted.value = true;
  scheduleNextTick();
});

onUnmounted(() => {
  if (timerTimeout) {
    clearTimeout(timerTimeout);
  }
});
</script>

<template>
  <ClientOnly>
    <span v-if="isMounted && isRecent">
      {{ liveRelativeText }}
    </span>

    <NuxtTime
      v-else
      :datetime="datetime"
      locale="en-GB"
      month="short"
      day="numeric"
    />

    <template #fallback>
      <NuxtTime
        :datetime="datetime"
        locale="en-GB"
        month="short"
        day="numeric"
      />
    </template>
  </ClientOnly>
</template>
