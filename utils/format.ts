export function formatCurrency(
  amount: number,
  locale = "en-IN",
  currency = "INR",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(
  date: Date | string,
  locale = "en-IN",
  options?: Intl.DateTimeFormatOptions,
): string {
  const value = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    ...options,
  }).format(value);
}
