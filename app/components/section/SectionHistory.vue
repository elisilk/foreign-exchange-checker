<script setup lang="ts">
const exchange = useExchangeStore();

const timeScaleItems = computed(() => Object.keys(timeScaleOptions));

const timeScaleStartDate = computed(() => timeScaleOptions[exchange.historyTimeScale]?.startDate);

const historyCacheKey = computed(() => `history-${exchange.base}-${exchange.quote}-${exchange.historyTimeScale}`);

type CachedPayload<T> = {
  payload: T;
  fetchedAt: number;
};

const { data, pending, error } = useLazyAsyncData<CachedPayload<Rate[]>>(
  historyCacheKey,
  async () => {
    const response = await $fetch<Rate[]>(
      "https://api.frankfurter.dev/v2/rates",
      {
        query: {
          providers: exchange.provider,
          base: exchange.base,
          quotes: exchange.quote,
          from: timeScaleStartDate.value,
        },
      },
    );
    return {
      payload: response,
      fetchedAt: Date.now(),
    };
  },
  {
    transform: (response) => {
      if (exchange.historyTimeScale !== "1D")
        return response;

      const { payload, fetchedAt } = response;
      return {
        payload: payload.slice(-2),
        fetchedAt,
      };
    },
    getCachedData(key, nuxtApp) {
      const cached = (nuxtApp.payload.data[key] || nuxtApp.static.data[key]) as CachedPayload<any> | undefined;
      if (!cached) {
        return;
      }

      // Frankfurter API's standard 16:00 CET release schedule
      const TTL = 60 * 60 * 1000; // 1 hour
      // const TTL = 20 * 1000; // 20 seconds
      const age = Date.now() - cached.fetchedAt;
      const isExpired = age > TTL;

      if (isExpired) {
        return;
      }

      return cached;
    },
  },
);

const ratesLastFetched = computed(() => data.value?.fetchedAt && dateTimeFormatter.format(new Date(data.value?.fetchedAt)));

const ratesIsEmpty = computed(() => {
  if (!data.value || !data.value.payload)
    return true;
  const rates = data.value.payload;
  return Object.keys(rates).length === 0;
});

const rateHistory = computed(() => data.value?.payload);

const rateOpen = computed(() => rateHistory.value?.[0]?.rate);

const rateLast = computed(() => rateHistory.value?.at(-1)?.rate);

const rateChange = computed(() => rateOpen.value && rateLast.value ? Number((rateLast.value - rateOpen.value).toPrecision(4)) : undefined);

const ratePercentChange = computed<number>(() => (rateOpen.value === undefined || rateLast.value === undefined) ? 0 : Number((100 * (rateLast.value - rateOpen.value) / rateLast.value).toPrecision(2)));

const ratePercentChangeIsPositive = computed<boolean>(() => ratePercentChange.value >= 0);
</script>

<template>
  <section aria-label="History">
    <UEmpty
      v-if="error || ratesIsEmpty"
      title="No chart data available"
    >
      <template #description>
        We couldn't load rate history for {{ exchange.base }}/{{ exchange.quote }} right now. This usually clears up in a minute.
      </template>
    </UEmpty>

    <div v-else class="space-y-8">
      <div class="flex gap-5 justify-between items-center flex-wrap">
        <!-- quantitative summary -->
        <div class="w-full grid gap-2.5 grid-cols-2 md:w-auto md:gap-4 md:grid-cols-[repeat(4,140px)]">
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
        <UTooltip
          :text="`${APP_SHORTCUTS.cycleHistoryTimeScaleForward.label}`"
          :kbds="APP_SHORTCUTS.cycleHistoryTimeScaleForward.kbds"
        >
          <URadioGroup
            v-model="exchange.historyTimeScale"
            orientation="horizontal"
            color="neutral"
            variant="card"
            :items="timeScaleItems"
            indicator="hidden"
            :disabled="pending"
          />
        </UTooltip>
      </div>

      <!-- chart display -->
      <UCard
        :title="`${exchange.base}/${exchange.quote}`"
        :description="`${rateLast} · ${ratesLastFetched}`"
        class="h-94.25"
      >
        <template v-if="!pending && rateHistory">
          <SectionHistoryChart :data="rateHistory" />
        </template>
        <template v-else>
          <USkeleton class="h-full w-full" />
        </template>
      </UCard>
    </div>
  </section>
</template>
