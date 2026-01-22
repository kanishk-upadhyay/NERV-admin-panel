/**
 * Sequential ID Generator
 *
 * Generates sequential IDs for new entities to maintain consistency
 * with seed data (1, 2, 3...) instead of timestamps.
 */

/**
 * Generate next sequential ID from a collection.
 */
export const generateNextId = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return 1;
  }

  const maxId = Math.max(...items.map((item) => item.id || 0));
  return maxId + 1;
};

export default generateNextId;
