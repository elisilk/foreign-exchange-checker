<script setup lang="ts">
type Props = {
  id: string;
};

const { id } = defineProps<Props>();

const exchange = useExchangeStore();

const selectedCurrency = defineModel<string>();

const elementId = computed(() => `currency-select-${id}`);
</script>

<template>
  <label>
    <span>{{ id }}:</span>
    <select
      :id="elementId"
      v-model="selectedCurrency"
      :name="elementId"
    >
      <option
        v-for="currencyOption in exchange.currencies"
        :key="currencyOption.iso_numeric"
        :value="currencyOption.iso_code"
      >
        {{ currencyOption.iso_code }}
        {{ currencyOption.name }}
      </option>
    </select>
  </label>
</template>

<style scoped>
label {
  display: flex;
  gap: 1ch;
  align-items: center;
}

select {
  appearance: base-select;
}

option {
  display: flex;
  gap: 1rem;
}
</style>
