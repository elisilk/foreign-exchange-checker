<script setup lang="ts">
type Props = {
  data: Rate[];
};

const { data } = defineProps<Props>();

const categories: Record<string, BulletLegendItemInterface> = {
  rate: { name: "Rate", color: "var(--ui-primary)" },
};

function xFormatter(tick: number, _i?: number, _ticks?: number[]): string {
  return `${data[tick]?.date ?? ""}`;
}

const yMinValue = computed(() => data.reduce((minVal, rate) => (rate.rate !== undefined && rate.rate < minVal) ? rate.rate : minVal, Infinity));

const yMaxValue = computed(() => data.reduce((maxVal, rate) => (rate.rate !== undefined && rate.rate > maxVal) ? rate.rate : maxVal, -Infinity));

const yExtentDomain = computed<[number, number]>(() => [yMinValue.value, yMaxValue.value]);

const yExtentExpansion = 0.25;

const yDomain = computed<[number, number]>(() => {
  const yRange = yExtentDomain.value[1] - yExtentDomain.value[0];
  const yRangeExpansion = yRange * yExtentExpansion;
  return [
    yExtentDomain.value[0] - yRangeExpansion,
    yExtentDomain.value[1] + yRangeExpansion,
  ];
});
</script>

<template>
  <div>
    <AreaChart
      :data
      :height="300"
      :categories="categories"
      :hide-legend="true"
      :x-formatter="xFormatter"
      :y-domain="yDomain"
    />
  </div>
</template>
