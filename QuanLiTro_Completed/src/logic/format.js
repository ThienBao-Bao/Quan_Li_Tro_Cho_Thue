export function formatPrice(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function parsePriceToNumber(priceStr, defaultValue = 4000000) {
  const digitsOnly = String(priceStr).replace(/[^0-9]/g, '');
  return parseInt(digitsOnly, 10) || defaultValue;
}
