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

export function formatRelativeTime(date: string | Date) {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return then.toLocaleDateString();
}
