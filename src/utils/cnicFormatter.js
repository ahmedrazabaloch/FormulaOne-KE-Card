/**
 * Pakistani CNIC format: 00000-0000000-0
 */
export const CNIC_REGEX = /^\d{5}-\d{7}-\d{1}$/;

/**
 * Format a raw digit string into Pakistani CNIC format (00000-0000000-0)
 * @param {string} raw - Raw input value
 * @returns {string} Formatted CNIC string
 */
export const formatCNIC = (raw) => {
  let value = raw.replace(/\D/g, "");

  if (value.length > 13) {
    value = value.slice(0, 13);
  }

  let formatted = "";
  if (value.length > 0) {
    formatted = value.slice(0, 5);
  }
  if (value.length > 5) {
    formatted += "-" + value.slice(5, 12);
  }
  if (value.length > 12) {
    formatted += "-" + value.slice(12, 13);
  }

  return formatted;
};
