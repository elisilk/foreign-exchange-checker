export function scrollToTop() {
  if (import.meta.client) {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Use 'auto' for an instant jump
    });
  }
}
