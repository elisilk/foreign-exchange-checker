<script setup lang="ts">
const base = defineModel("base", { type: String });
const quote = defineModel("quote", { type: String });

function swap() {
  [base.value, quote.value] = [quote.value, base.value];
}
</script>

<template>
  <button @click="swap">
    swap
  </button>
</template>
