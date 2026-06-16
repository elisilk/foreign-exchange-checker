<script setup lang="ts">
type Props = {
  base: string;
};

const { base } = defineProps<Props>();

// https://api.frankfurter.dev/v2/rates?base=EUR&from=2026-06-14&to=2026-06-15
// https://api.frankfurter.dev/v2/rates?base=EUR&from=2026-06-14&to=2026-06-15&providers=ECB

const today = ref();
const yesterday = ref();

onMounted(() => {
  const todayDate = new Date();
  const yesterdayDate = new Date();

  yesterdayDate.setDate(todayDate.getDate() - 1);

  today.value
    = todayDate.toISOString().split("T")[0];
  yesterday.value = yesterdayDate.toISOString().split("T")[0];
});

const { status, data } = useFetch<Rate[]>(
  () => `https://api.frankfurter.dev/v2/rates?base=${base}${yesterday.value ? `&from=${yesterday.value}` : ""}${today.value ? `&to=${today.value}` : ""}`,
  {
    lazy: true,
  },
);

const groupedData = computed(() => data.value ? Object.groupBy([...data.value].sort((a, b) => a.date.localeCompare(b.date)), rate => rate.quote) : []);

const filteredGroups = computed(() => Object.fromEntries(
  Object.entries(groupedData.value).filter(([_key, value]) => value && value.length === 2),
));

function getDirection(change: number | undefined) {
  if (change === undefined)
    return undefined;
  if (change > 0)
    return "positive";
  if (change < 0)
    return "negative";
  return "no change"; // if (change === 0)
}

const transformedGroups = computed(() => Object.values(filteredGroups.value).map((pair) => {
  if (!pair || pair.length !== 2)
    return undefined;

  const rateChange = pair[1]?.rate && pair[0]?.rate ? pair[1]?.rate - pair[0]?.rate : undefined;

  const rateChangePercent = pair[1]?.rate && pair[0]?.rate && (rateChange === 0 || rateChange) ? 100 * rateChange / pair[0]?.rate : undefined;

  return {
    base: pair[0]?.base,
    quote: pair[0]?.quote,
    rate1: pair[0]?.rate,
    rate2: pair[1]?.rate,
    date1: pair[0]?.date,
    date2: pair[1]?.date,
    rateChange,
    rateChangePercent,
    rateChangeDirection: getDirection(rateChange),
  };
}));
</script>

<template>
  <div>
    <h2>Live markets</h2>

    <div v-if="status === 'pending'">
      Loading ...
    </div>

    <div v-else-if="status === 'success' && data">
      <div
        v-for="pair in transformedGroups"
        :key="`${pair?.base}-${pair?.quote}`"
        class="pair"
      >
        <span>{{ pair?.base }}/{{ pair?.quote }}</span>
        <span>{{ pair?.rate2?.toPrecision(5) }}</span>
        <span>{{ pair?.rateChangePercent?.toFixed(2) }}%</span>
        <span>{{ pair?.rateChangeDirection }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pair {
  display: flex;
  gap: 1ch;
}
</style>
