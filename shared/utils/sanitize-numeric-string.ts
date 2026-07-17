export function sanitizeNumericString(input: string): string {
  if (!input)
    return "0";

  let clean = input.trim();

  const lastComma = clean.lastIndexOf(",");
  const lastDot = clean.lastIndexOf(".");

  // Case 1: Both separators exist (e.g., "1.250,50" or "1,250.50")
  if (lastComma !== -1 && lastDot !== -1) {
    if (lastComma > lastDot) {
      // 🇪🇺 European style: "1.250,50" -> Remove thousands dots, turn comma to dot
      clean = clean.replace(/\./g, "").replace(",", ".");
    }
    else {
      // 🇺🇸 English style: "1,250.50" -> Simply strip out thousands commas
      clean = clean.replace(/,/g, "");
    }
    return clean;
  }

  // Case 2: Only commas exist (e.g., "1,250" or "10,5")
  if (lastComma !== -1) {
    // If the comma is followed by exactly 3 digits, it's likely a thousands separator (e.g., "1,250")
    // Otherwise, it's a decimal separator (e.g., "10,5" or "1,25")
    const isThousands = /,\d{3}$/.test(clean);

    if (isThousands) {
      return clean.replace(/,/g, ""); // Strip it: "1,250" -> "1250"
    }
    else {
      return clean.replace(",", "."); // Convert it: "10,5" -> "10.5"
    }
  }

  // Case 3: Only dots or no separators exist (e.g., "1250.50" or "1250"), so nothing needed
  return clean;
}
