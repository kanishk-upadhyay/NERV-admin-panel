import { useState, useMemo } from "react";

/**
 * Sortable Data Hook
 *
 * Provides table sorting functionality with ascending/descending toggle.
 * Handles both numeric and string values with case-insensitive comparison.
 *
 * @param {Array} items - Array of objects to sort
 * @param {Object} config - Initial sort configuration (optional)
 * @returns {Object} Sorted items, sort request function, and current sort config
 *
 * @example
 * const { items: sortedUsers, requestSort, sortConfig } = useSortableData(users);
 * // In table header: onClick={() => requestSort('name')}
 */
export const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Check if values are date strings (e.g. YYYY-MM-DD)
        const isDateString = (v) =>
          typeof v === "string" &&
          /^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(v) &&
          !isNaN(Date.parse(v));

        if (isDateString(aValue) && isDateString(bValue)) {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (
          typeof aValue === "number" ||
          typeof bValue === "number" ||
          (!isNaN(Number(aValue)) &&
            !isNaN(Number(bValue)) &&
            aValue !== "" &&
            bValue !== "")
        ) {
          // Numeric comparison for numbers
          aValue = Number(aValue);
          bValue = Number(bValue);
        } else {
          // Case-insensitive string comparison
          aValue = aValue != null ? aValue.toString().toLowerCase() : "";
          bValue = bValue != null ? bValue.toString().toLowerCase() : "";
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    // Toggle direction if clicking the same column
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};
