export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(value);
}

export const formatValue = (value: number | undefined) => {
  if (!value) return "";

  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};
