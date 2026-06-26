export function getRelativeDate(daysAgo: number = 0): string {
  const date = new Date();

  if (daysAgo !== 0)
    date.setDate(date.getDate() - daysAgo);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getTodaysDate(): string {
  return getRelativeDate();
}

export function getYesterdaysDate(): string {
  return getRelativeDate(1);
}
