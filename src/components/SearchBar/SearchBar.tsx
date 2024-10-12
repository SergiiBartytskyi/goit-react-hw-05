import { FormEvent } from "react";
import { ISearchBarProps } from "./SearchBar.types";
import css from "./SearchBar.module.css";

const SearchBar = ({ onSearch }: ISearchBarProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("query") as HTMLInputElement;
    const query = input.value.trim();

    if (!query) return;
    onSearch(query);

    form.reset();
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <input
        type="text"
        name="query"
        className={css.search}
        placeholder="Search for movies..."
        autoFocus
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
