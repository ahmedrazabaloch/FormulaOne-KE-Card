const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Convert YYYY-MM to MMM-YYYY display format
 * @param {string} value - Date string in YYYY-MM format
 * @returns {string} Formatted date string (e.g., "Jan-2025")
 */
export const formatMonthYear = (value) => {
  if (!value) return "";
  const [y, m] = value.split("-").map(Number);
  const month = MONTH_NAMES[(m || 1) - 1];
  return `${month}-${y}`;
};

/**
 * Add one year to a YYYY-MM date and return in MMM-YYYY format
 * @param {string} value - Date string in YYYY-MM format
 * @returns {string} Date one year later in MMM-YYYY format
 */
export const addOneYear = (value) => {
  if (!value) return "";
  const [y, m] = value.split("-").map(Number);
  const date = new Date(y, (m || 1) - 1, 1);
  date.setFullYear(date.getFullYear() + 1);
  const fy = date.getFullYear();
  const fm = date.getMonth() + 1;
  const mm = fm.toString().padStart(2, "0");
  return formatMonthYear(`${fy}-${mm}`);
};

/**
 * Convert MMM-YYYY display format back to YYYY-MM for input[type="month"]
 * @param {string} value - Date string in MMM-YYYY format (e.g., "Jan-2025")
 * @returns {string} Date in YYYY-MM format (e.g., "2025-01")
 */
export const displayToInputValue = (value) => {
  if (!value) return "";
  if (/^[A-Za-z]{3}-\d{4}$/.test(value)) {
    const [mm, yy] = value.split("-");
    const idx = MONTH_NAMES.indexOf(mm) + 1;
    const m2 = idx.toString().padStart(2, "0");
    return `${yy}-${m2}`;
  }
  return value;
};

export { MONTH_NAMES };
