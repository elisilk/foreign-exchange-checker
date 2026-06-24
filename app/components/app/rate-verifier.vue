<script setup lang="ts">
const exchange = useExchangeStore();

const { data, pending, error } = useLazyFetch<Rate>(() => `https://api.frankfurter.dev/v2/rate/${exchange.base}/${exchange.quote}?providers=${exchange.provider}`);
</script>

<template>
  <section aria-labelledby="rate-verifier-heading" class="space-y-4">
    <h2 id="rate-verifier-heading">
      Rate Verifier
    </h2>
  </section>

  <UCard>
    <div v-if="!exchange.rate">
      No rate available
    </div>
    <div v-else class="grid gap-4 md:gap-6 md:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)] items-center justify-items-center">
      <div class="text-center space-y-2">
        <h3>Calculated Rate</h3>
        <div>1 {{ exchange.base }} = {{ exchange.rate }} {{ exchange.quote }}</div>
      </div>

      <div>VS</div>

      <div class="text-center space-y-2">
        <h3>Fetched Rate</h3>

        <div v-if="pending">
          Loading...
        </div>
        <div v-else-if="!pending && data">
          1 {{ data.base }} = {{ data.rate }} {{ data.quote }}
        </div>
        <div v-else>
          Error loading data: {{ error }}
        </div>
      </div>
    </div>
  </UCard>
</template>
