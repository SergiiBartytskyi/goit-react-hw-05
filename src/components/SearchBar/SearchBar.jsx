import { useState, forwardRef } from "react";
import css from "./SearchBar.module.css";

const SearchBar = forwardRef(function SearchBarComponent({ onSearch }, ref) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={css.form} ref={ref}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={css.search}
      />
      <button type="submit">Search</button>
    </form>
  );
});

export default SearchBar;
