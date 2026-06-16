<script setup lang="ts">
type Props = {
  id: string;
  currencies: Currency[];
};

const { id } = defineProps<Props>();

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
        v-for="currency in currencies"
        :key="currency.iso_numeric"
        :value="currency.iso_code"
      >
        {{ currency.iso_code }}
        {{ currency.name }}
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
