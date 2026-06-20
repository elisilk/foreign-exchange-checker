export function getFlagIcon(isoCode: CurrencyCode) {
  const countries = currencyToCountryMap[isoCode];
  const countryCode = countries && countries.length > 0
    ? countries[0]
    : undefined;
  return countryCode ? `circle-flags:${countryCode.toLowerCase()}` : "ion:star";
}
