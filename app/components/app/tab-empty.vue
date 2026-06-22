<template>
  <div class="mx-auto text-center py-10 space-y-4">
    <h3 class="text-3xl">
      <slot name="heading" />
    </h3>
    <p class="text-lg text-pretty">
      <slot />
    </p>
  </div>
</template>
