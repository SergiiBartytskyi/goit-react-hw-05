import { forwardRef } from "react";
import css from "./SearchBar.module.css";

const SearchBar = forwardRef(function SearchBarComponent({ onSearch }, ref) {
  const handleSubmit = (e) => {
    e.preventDefault();

    const query = e.target.elements.query.value;
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className={css.form} ref={ref}>
      <input type="text" name="query" className={css.search} />
      <button type="submit">Search</button>
    </form>
  );
});

export default SearchBar;
