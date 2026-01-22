/**
 * Search Bar Component
 *
 * Controlled input with search icon and optional clear button.
 * Displays clear button only when value is non-empty.
 *
 * @param {string} value - Current search query
 * @param {Function} onChange - Callback with new search value
 * @param {string} placeholder - Input placeholder text (default: "Search...")
 */
const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="relative w-full max-w-md group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-on-surface-variant group-focus-within:text-primary transition-colors">
          🔍
        </span>
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2.5 border-2 border-outline-variant/30 rounded-full leading-5 bg-surface-container text-on-surface placeholder-on-surface-variant/70 focus:outline-none focus:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 shadow-sm hover:shadow-md"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-error transition-colors"
          aria-label="Clear search query"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
