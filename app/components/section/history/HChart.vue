<script setup lang="ts">
type Props = {
  data: Rate[];
};

const { data } = defineProps<Props>();

const categories: Record<string, BulletLegendItemInterface> = {
  rate: { name: "Rate", color: "var(--ui-primary)" },
};

function xFormatter(tick: number, _i?: number, _ticks?: number[]): string {
  return `${(data[tick]?.date && dateFormatter.format(new Date(data[tick]?.date))) ?? ""}`;
}

// const yFormatter = (value: number): string => decimalFormatter.format(value);
const yFormatter = (value: number): string => Number(value).toPrecision(4);

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
  <div class="h-75">
    <AreaChart
      :data
      :height="300"
      :categories="categories"
      :hide-legend="true"
      :x-formatter="xFormatter"
      :y-formatter="yFormatter"
      :y-domain="yDomain"
      :y-grid-line="true"
      :curve-type="CurveType.Linear"
    >
      <template #tooltip="{ values }">
        <div class="grid justify-items-center">
          <span>{{ (values?.date && dateFormatter.format(new Date(values.date))) ?? '' }}</span>
          <span>{{ values?.rate ?? '' }}</span>
        </div>
      </template>
    </AreaChart>
  </div>
</template>
