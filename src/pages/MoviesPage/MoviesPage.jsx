import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../../fetchTMDB";
import SearchBar from "../../components/SearchBar/SearchBar";
import MovieList from "../../components/MovieList/MovieList";
import LoadMoreBtn from "../../components/LoadMoreBtn/LoadMoreBtn";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { BiArrowToTop } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";
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

  console.log(searchParams);

  useEffect(() => {
    if (!loading && lastMovieRef.current) {
      lastMovieRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [movies, loading]);

  useEffect(() => {
    if (query) {
      const controller = new AbortController();
      const signal = controller.signal;

      const fetchMovies = async () => {
        try {
          setLoading(true);
          setError(false);
          const data = await searchMovies(query, {
            signal,
            page: currentPage,
          });
          setMovies((prevMovies) => [...prevMovies, ...data.results]);
          setTotalPages(data.totalPages);
          setHasSearched(true);
          console.log("After fetch");
        } catch (error) {
          if (error.name !== "AbortError") {
            setError(true);
          }
          console.log("MoviePage Error");
        } finally {
          setLoading(false);
        }
      };

      fetchMovies();

      return () => {
        controller.abort();
      };
    }
  }, [query, currentPage]);

  const handleSearch = async (newQuery) => {
    if (newQuery === "") {
      toast.error("Enter some title!");
      return;
    } else {
      setSearchParams({ query: newQuery });
      setMovies([]);
      setCurrentPage(1);
    }
  };

  const loadMoreMovies = () => {
    const nextPage = currentPage + 1;

    setCurrentPage(nextPage);
  };

  const scrollToTop = () => {
    if (searchFormRef.current) {
      searchFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const shouldShowLoadMore =
    movies.length > 0 && currentPage < totalPages && !loading;

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
      <Toaster position="top-right" reverseOrder={false} />

      <button onClick={scrollToTop} className={css.scrollBtn}>
        <BiArrowToTop className={css.reactIcons} />
      </button>
    </main>
  );
};

export default MoviesPage;
