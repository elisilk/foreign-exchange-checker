<script setup lang="ts">
type Props = {
  provider: string;
  numCurrencies: number;
};

const { provider, numCurrencies } = defineProps<Props>();
</script>

<template>
  <header>
    <h1>FX Checker</h1>
    <div>
      {{ numCurrencies }} Currencies · EOD · {{ provider }} data
    </div>
  </header>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
