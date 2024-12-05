export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export const formatValue = (value: number | undefined) => {
  if (!value) return "";

  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};
