<script setup lang="ts">
const exchange = useExchangeStore();
const isCopied = ref(false);

async function handleShareLinkCopy() {
  const fullShareUrl = exchange.generateShareLink();

  try {
    await navigator.clipboard.writeText(fullShareUrl);
    isCopied.value = true;

    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  }
  catch (err) {
    console.error("Failed to copy share link: ", err);
  }
}
</script>

<template>
  <UButton
    :variant="isCopied ? 'solid' : 'outline'"
    :label="isCopied ? 'Link Copied!' : 'Share View'"
    :icon="isCopied ? 'ion:checkmark' : 'ion:share-outline'"
    class="h-8 w-33 justify-center"
    :class="isCopied ? 'text-inverted capitalize' : 'text-highlighted'"
    :disabled="isCopied"
    @click="handleShareLinkCopy"
  />
</template>
