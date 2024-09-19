// // import { useSearchParams } from "react-router-dom";
// import css from "./SearchBar.module.css";

// const SearchBar = ({ onSearch }) => {
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const query = e.target.elements.query.value;
//     onSearch(query.trim());

//     e.target.reset();
//   };

//   return (
//     <form onSubmit={handleSubmit} className={css.form}>
//       <input type="text" name="query" className={css.search} />
//       <button type="submit">Search</button>
//     </form>
//   );
// };

// export default SearchBar;

// ---------------------------

import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import css from "./SearchBar.module.css";
import { addQuery, selectQuery } from "../../redux/query/querySlice";
import { clearMovies } from "../../redux/movies/moviesSlice";
import toast, { Toaster } from "react-hot-toast";

const SearchBar = () => {
  const dispatch = useDispatch();
  // const query = useSelector(selectQuery);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newQuery = e.target.elements.query.value;

    if (!newQuery.trim()) {
      toast.error("Enter some title!");
      return;
    }
    dispatch(clearMovies());
    setSearchParams({ query: newQuery, page: 1 });
    dispatch(addQuery(newQuery));

    e.target.reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={css.form}>
        <input
          type="text"
          name="query"
          className={css.search}
          // defaultValue={query}
        />
        <button type="submit">Search</button>
      </form>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default SearchBar;
