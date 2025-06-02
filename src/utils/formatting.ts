/**
 * Utility functions for formatting data
 */

/**
 * Format price from cents to a display string
 * @param cents Price in cents
 * @param currency Currency symbol (default: €)
 * @returns Formatted price string (e.g., "€2.99")
 */
export function formatPrice(cents: number, currency: string = '€'): string {
  const euros = cents / 100;
  return `${currency}${euros.toFixed(2)}`;
}

/**
 * Format unit price with unit description
 * @param cents Price in cents
 * @param unit Unit description (e.g., "per kg", "per liter")
 * @param currency Currency symbol (default: €)
 * @returns Formatted unit price string (e.g., "€2.99 per kg")
 */
export function formatUnitPrice(cents: number, unit: string, currency: string = '€'): string {
  return `${formatPrice(cents, currency)} ${unit}`;
}

/**
 * Format a date to a readable string
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Truncate text to a maximum length
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}
