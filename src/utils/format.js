/**
 * Formatting Utilities
 *
 * Shared formatting functions for consistent display across the application.
 */

/**
 * Format number as INR currency.
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
