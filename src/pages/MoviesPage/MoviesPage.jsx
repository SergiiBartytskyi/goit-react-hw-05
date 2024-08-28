// import { useState, useEffect, useRef } from "react";
// import { useSearchParams } from "react-router-dom";
// import { searchMovies } from "../../fetchTMDB";
// import MovieList from "../../components/MovieList/MovieList";
// import Loader from "../../components/Loader/Loader";
// import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
// import { BiArrowToTop } from "react-icons/bi";
// import css from "./MoviesPage.module.css";

// const MoviesPage = () => {
//   const [movies, setMovies] = useState([]);
//   const [searchParams, setSearchParams] = useSearchParams();
//   const query = searchParams.get("query") || "";
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [hasSearched, setHasSearched] = useState(false);
//   const searchFormRef = useRef(null);

//   useEffect(() => {
//     if (query) {
//       const controller = new AbortController();
//       const signal = controller.signal;

//       const fetchMovies = async () => {
//         try {
//           setLoading(true);
//           setError(false);
//           const results = await searchMovies(query, { signal });
//           setMovies(results);
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
//   }, [query]);

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     const form = e.currentTarget;
//     const newQuery = form.elements.search.value.trim();

//     if (newQuery === "") {
//       setSearchParams({});
//       setMovies([]);
//       setHasSearched(false);
//     } else {
//       setSearchParams({ query: newQuery });
//     }
//   };

//   const scrollToTop = () => {
//     if (searchFormRef.current) {
//       searchFormRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   if (loading) return <Loader />;
//   if (error) return <ErrorMessage />;

//   return (
//     <main className={css.container}>
//       <form onSubmit={handleSearch} className={css.form}>
//         <input
//           type="text"
//           name="search"
//           defaultValue={query}
//           className={css.search}
//         />
//         <button type="submit">Search</button>
//       </form>
//       {hasSearched &&
//         (movies.length > 0 ? (
//           <MovieList movies={movies} />
//         ) : (
//           <div className={css.error}>Not found!</div>
//         ))}
//       <button onClick={scrollToTop} className={css.scrollBtn}>
//         <BiArrowToTop className={css.reactIcons} />
//       </button>
//     </main>
//   );
// };

// export default MoviesPage;

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../../fetchTMDB";
import MovieList from "../../components/MovieList/MovieList";
import Loader from "../../components/Loader/Loader";
import SearchBar from "../../components/SearchBar/SearchBar";
import LoadMoreBtn from "../../components/LoadMoreBtn/LoadMoreBtn";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { BiArrowToTop } from "react-icons/bi";
import css from "./MoviesPage.module.css";

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const searchFormRef = useRef(null);
  const lastMovieRef = useRef(null);

  useEffect(() => {
    if (!loading && lastMovieRef.current) {
      lastMovieRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [movies, loading]);

  const handleSearch = async (newQuery) => {
    if (newQuery === "") {
      setSearchParams({});
      setMovies([]);
      setHasSearched(false);
      setCurrentPage(1);
    } else {
      setSearchParams({ query: newQuery });
      setCurrentPage(1);
    }

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setLoading(true);
      setError(false);
      const data = await searchMovies(newQuery, {
        signal,
        page: currentPage,
      });
      setMovies(data.results);
      setTotalPages(data.totalPages);
      setHasSearched(true);
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(true);
      }
    } finally {
      setLoading(false);
    }

    return () => {
      controller.abort();
    };
  };

  const loadMoreMovies = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const data = await searchMovies(query, {
        signal,
        page: nextPage,
      });
      setMovies((prevMovies) => [...prevMovies, ...data.results]);
      setCurrentPage(nextPage);
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(true);
      }
    } finally {
      setLoading(false);
    }

    return () => {
      controller.abort();
    };
  };

  const scrollToTop = () => {
    if (searchFormRef.current) {
      searchFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const shouldShowLoadMore =
    movies.length > 0 && currentPage < totalPages && !loading;

  // if (loading) return <Loader />;
  // if (error) return <ErrorMessage />;

  return (
    <main className={css.container}>
      <SearchBar onSearch={handleSearch} ref={searchFormRef} />
      {hasSearched &&
        (movies.length > 0 ? (
          <MovieList movies={movies} lastMovieRef={lastMovieRef} />
        ) : (
          <div className={css.error}>Not found!</div>
        ))}
      {shouldShowLoadMore && <LoadMoreBtn onClick={loadMoreMovies} />}
      {loading && <Loader />}
      {error && <ErrorMessage />}
      <button onClick={scrollToTop} className={css.scrollBtn}>
        <BiArrowToTop className={css.reactIcons} />
      </button>
    </main>
  );
};

export default MoviesPage;
