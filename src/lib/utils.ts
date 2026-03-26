export function formatKSh(amount: number) {
  const formatted = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  }).format(amount);
  return formatted.replace(/KES|Ksh/g, "KSh");
}

export function formatCompactKSh(amount: number) {
  const formatted = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
  return formatted.replace(/KES|Ksh/g, "KSh");
}
