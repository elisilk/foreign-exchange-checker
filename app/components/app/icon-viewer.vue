<template>
  <section aria-labelledby="icon-viewer-heading">
    <h2 id="icon-viewer-heading">
      Icon Viewer
    </h2>

    <div class="icon-viewer-container">
      <img src="/icon-arrow-right.svg" alt="arrow right">
      <img src="/icon-check.svg" alt="check">
      <img src="/icon-chevron-down.svg" alt="chevron down">
      <img src="/icon-delete-filled.svg" alt="delete filled">
      <img src="/icon-delete.svg" alt="delete">
      <img src="/icon-exchange-vertical.svg" alt="exchange vertical">
      <img src="/icon-exchange.svg" alt="exchange">
      <img src="/icon-search.svg" alt="search">
      <img src="/icon-star-filled.svg" alt="star filled">
      <img src="/icon-star.svg" alt="star">
    </div>
  </section>
</template>

<style scoped>
section > * + * {
  margin-block-start: 1rem;
}

.icon-viewer-container {
  background: black;
  block-size: 100px;
  display: flex;
  gap: 1rem;
  place-content: center;
  place-items: center;
}
</style>
