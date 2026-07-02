<script setup lang="ts">
const exchange = useExchangeStore();

const timeScaleOptions = computed<Record<string, any>>(() => ({
  "1D": {
    startDate: getRelativeDate(3),
    groupBy: "",
  },
  "1W": {
    startDate: getRelativeDate(7),
    groupBy: "",
  },
  "1M": {
    startDate: getRelativeDate(30),
    groupBy: "",
  },
  "3M": {
    startDate: getRelativeDate(30 * 3),
    groupBy: "",
  },
  "1Y": {
    startDate: getRelativeDate(365),
    groupBy: "week",
  },
  "5Y": {
    startDate: getRelativeDate(365 * 5),
    groupBy: "month",
  },
}));

const timeScaleItems = computed(() => Object.keys(timeScaleOptions.value));

const timeScaleStartDate = computed(() => timeScaleOptions.value[exchange.historyTimeScale].startDate);

// const timeScaleGroupBy = computed(() => timeScaleOptions.value[timeScale.value].groupBy);

const { data: rateHistory, status } = useLazyFetch<Rate[]>(
  () =>
    `https://api.frankfurter.dev/v2/rates?base=${exchange.base}&quotes=${exchange.quote}&providers=${exchange.provider}&from=${timeScaleStartDate.value}`,
);

const rateOpen = computed(() => rateHistory.value?.[0]?.rate);

// const rateOpenDate = computed(() => rateHistory.value?.at(0)?.date);

// const rateOpenDateFormatted = computed(() => rateOpenDate.value && dateFormatter.format(new Date(rateOpenDate.value)));

const rateLast = computed(() => rateHistory.value?.at(-1)?.rate);

const rateLastDate = computed(() => rateHistory.value?.at(-1)?.date);

const rateLastDateFormatted = computed(() => rateLastDate.value && dateFormatter.format(new Date(rateLastDate.value)));

const rateChange = computed(() => rateOpen.value && rateLast.value ? Number((rateLast.value - rateOpen.value).toPrecision(4)) : undefined);

const ratePercentChange = computed<number>(() => (rateOpen.value === undefined || rateLast.value === undefined) ? 0 : Number((100 * (rateLast.value - rateOpen.value) / rateLast.value).toPrecision(2)));

const ratePercentChangeIsPositive = computed<boolean>(() => ratePercentChange.value >= 0);
</script>

<template>
  <section aria-label="History">
    <UEmpty
      v-if="status === 'error'"
      title="No chart data available"
    >
      <template #description>
        We couldn't load rate history for {{ exchange.base }}/{{ exchange.quote }} right now. This usually clears up in a minute.
      </template>
    </UEmpty>

    <div v-else-if="status === 'success' && rateHistory" class="space-y-8">
      <!-- quantitative summary -->
      <div class="grid gap-2.5 md:gap-4 grid-cols-2 md:grid-cols-[repeat(4,140px)]">
        <div class="px-5 py-3 bg-muted border border-default rounded-2xl grid gap-4">
          <div class="text-lg text-highlighted/70 uppercase">
            Open
          </div>
          <div class="text-3xl text-highlighted">
            {{ rateOpen || 'Error' }}
          </div>
        </div>

        <div class="px-5 py-3 bg-muted border border-default rounded-2xl grid gap-4">
          <div class="text-lg text-highlighted/70 uppercase">
            Last
          </div>
          <div class="text-3xl text-highlighted">
            {{ rateLast || 'Error' }}
          </div>
        </div>

        <div class="px-5 py-3 bg-muted border border-default rounded-2xl grid gap-4">
          <div class="text-lg text-highlighted/70 uppercase">
            Change
          </div>
          <div class="text-3xl flex gap-1 items-center" :class="[ratePercentChangeIsPositive ? 'text-success' : 'text-error']">
            <span>{{ ratePercentChangeIsPositive ? '+' : '' }}{{ rateChange }}</span>
          </div>
        </div>

        <div class="px-5 py-3 bg-muted border border-default rounded-2xl grid gap-4">
          <div class="text-lg text-highlighted/70 uppercase">
            % Change
          </div>
          <div class="text-3xl flex gap-1 items-center" :class="[ratePercentChangeIsPositive ? 'text-success' : 'text-error']">
            <UIcon :name="ratePercentChangeIsPositive ? 'ion:arrow-up-b' : 'ion:arrow-down-b'" class="size-5" />
            <span>{{ ratePercentChangeIsPositive ? '+' : '' }}{{ ratePercentChange.toFixed(2) }}%</span>
          </div>
        </div>
      </div>

      <!-- time scale input -->
      <URadioGroup
        v-model="exchange.historyTimeScale"
        orientation="horizontal"
        color="neutral"
        variant="card"
        :items="timeScaleItems"
        indicator="hidden"
      />

      <!-- chart display -->
      <UCard
        :title="`${exchange.base}/${exchange.quote}`"
        :description="`${rateLast} · ${rateLastDateFormatted}`"
      >
        <CurrencyChart :data="rateHistory" />
      </UCard>

      <!--
      <pre>
{{ rateHistory.length }}
{{ rateHistory }}
      </pre>
      -->
    </div>
  </section>
</template>
