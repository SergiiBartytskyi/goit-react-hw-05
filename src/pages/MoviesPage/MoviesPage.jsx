// import { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { searchMovies } from "../../fetchTMDB";
// import SearchBar from "../../components/SearchBar/SearchBar";
// import MovieList from "../../components/MovieList/MovieList";
// import LoadMoreBtn from "../../components/LoadMoreBtn/LoadMoreBtn";
// import Loader from "../../components/Loader/Loader";
// import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
// import toast, { Toaster } from "react-hot-toast";
// import css from "./MoviesPage.module.css";

// const MoviesPage = () => {
//   const [movies, setMovies] = useState([]);
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [hasSearched, setHasSearched] = useState(false);
//   const [totalPages, setTotalPages] = useState(1);

//   const query = searchParams.get("query") || "";
//   const currentPage = Number(searchParams.get("page")) || 1;

//   useEffect(() => {
//     if (!query) return;
//     if (query) {
//       const controller = new AbortController();
//       const signal = controller.signal;

//       const fetchMovies = async () => {
//         try {
//           setLoading(true);
//           setError(false);

//           const data = await searchMovies(query, {
//             signal,
//             page: currentPage,
//           });

//           setMovies((prevMovies) => [...prevMovies, ...data.results]);
//           setTotalPages(data.totalPages);
//           setHasSearched(true);
//         } catch (error) {
//           if (error.name !== "AbortError") {
//             setError(true);
//           }
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchMovies();

//       return () => {
//         controller.abort();
//       };
//     }
//   }, [query, currentPage]);

//   const handleSearch = (newQuery) => {
//     if (newQuery === "") {
//       toast.error("Enter some title!");
//       return;
//     } else {
//       setSearchParams({ query: newQuery, page: 1 });
//       setMovies([]);
//     }
//   };

//   const loadMoreMovies = () => {
//     searchParams.set("page", currentPage + 1);
//     setSearchParams(searchParams);
//   };

//   const shouldShowLoadMore =
//     movies.length > 0 && currentPage < totalPages && !loading;

//   return (
//     <main className={css.container}>
//       <SearchBar onSearch={handleSearch} />

//       {hasSearched &&
//         (movies.length > 0 ? (
//           <MovieList movies={movies} />
//         ) : (
//           <div className={css.error}>Not found!</div>
//         ))}

//       {shouldShowLoadMore && <LoadMoreBtn onClick={loadMoreMovies} />}

//       {loading && <Loader />}
//       {error && <ErrorMessage />}
//       <Toaster position="top-right" reverseOrder={false} />
//     </main>
//   );
// };

// export default MoviesPage;

// -----------------------

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMovies,
  selectMovies,
  selectMoviesError,
  selectMoviesLoading,
  selectMoviesSearched,
  selectTotalPages,
} from "../../redux/movies/moviesSlice";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../../redux/movies/operations";
import SearchBar from "../../components/SearchBar/SearchBar";
import MovieList from "../../components/MovieList/MovieList";
import LoadMoreBtn from "../../components/LoadMoreBtn/LoadMoreBtn";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import toast, { Toaster } from "react-hot-toast";
import css from "./MoviesPage.module.css";

const MoviesPage = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectMoviesLoading);
  const error = useSelector(selectMoviesError);
  const movies = useSelector(selectMovies);
  const totalPages = useSelector(selectTotalPages);
  const hasSearched = useSelector(selectMoviesSearched);
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    if (!query) {
      dispatch(clearMovies());
    }
  }, [dispatch, query]);

  useEffect(() => {
    if (!query) return;

    dispatch(searchMovies({ query, page: currentPage }));
  }, [dispatch, query, currentPage]);

  const loadMoreMovies = () => {
    searchParams.set("page", currentPage + 1);
    setSearchParams(searchParams);
  };

  const shouldShowLoadMore =
    movies.length > 0 && currentPage < totalPages && !isLoading;

  return (
    <main className={css.container}>
      <SearchBar />
      {/* {hasSearched &&
        (movies.length > 0 ? (
          <MovieList />
        ) : (
          <div className={css.error}>Not found!</div>
        ))} */}
      {movies.length > 0 && <MovieList />}
      {shouldShowLoadMore && <LoadMoreBtn onClick={loadMoreMovies} />}
      {isLoading && <Loader />}
      {error && <ErrorMessage />}
      {/* <Toaster position="top-right" reverseOrder={false} /> */}
    </main>
  );
};

export default MoviesPage;
