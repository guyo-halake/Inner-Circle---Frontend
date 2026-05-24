export function formatKSh(amount: number) {
  const formatted = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  }).format(amount);
  return formatted.replace(/KES|Ksh/g, "KSh");
}

export function formatCompactKSh(amount: number) {
  if (amount >= 1e9) {
    const val = amount / 1e9;
    return `KSh ${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}B`;
  }
  if (amount >= 1e6) {
    const val = amount / 1e6;
    return `KSh ${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}M`;
  }
  if (amount >= 1e3) {
    const val = amount / 1e3;
    return `KSh ${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}K`;
  }
  return `KSh ${amount.toFixed(2)}`;
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
