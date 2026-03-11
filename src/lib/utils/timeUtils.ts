/**
 * Format a date to a relative time string in Danish
 * Examples: "Nu", "For 2 min siden", "For 1 time siden", "I går", "For 3 dage siden"
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return "Nu";
  } else if (diffMinutes < 60) {
    return `For ${diffMinutes} min siden`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? "For 1 time siden" : `For ${diffHours} timer siden`;
  } else if (diffDays === 1) {
    return "I går";
  } else if (diffDays < 7) {
    return `For ${diffDays} dage siden`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "For 1 uge siden" : `For ${weeks} uger siden`;
  } else {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? "For 1 måned siden" : `For ${months} måneder siden`;
  }
}
