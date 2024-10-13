import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../../fetchTMDB";
import SearchBar from "../../components/SearchBar/SearchBar";
import MovieList from "../../components/MovieList/MovieList";
import LoadMoreBtn from "../../components/LoadMoreBtn/LoadMoreBtn";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import toast, { Toaster } from "react-hot-toast";
import { IMovie } from "../../types";
import css from "./MoviesPage.module.css";

const MoviesPage = () => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);

  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    if (!query) return;
    if (query) {
      const controller = new AbortController();
      const signal = controller.signal;

      const fetchMovies = async () => {
        try {
          setLoading(true);
          setError(null);

          const data = await searchMovies(query, {
            signal,
            page: currentPage,
          });

          setMovies((prevMovies) => [...prevMovies, ...data.results]);
          setTotalPages(data.total_pages);
          setHasSearched(true);
        } catch (error) {
          if (error instanceof Error) {
            if (error.name !== "AbortError") {
              setError(error.message);
            }
          } else {
            setError("An unknown error has occurred.");
          }
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

  const handleSearch = (newQuery: string) => {
    if (!newQuery) {
      toast.error("Enter some title!");
      return;
    }
    setSearchParams({ query: newQuery, page: "1" });
    setMovies([]);
  };

  const loadMoreMovies = () => {
    searchParams.set("page", (currentPage + 1).toString());
    setSearchParams(searchParams);
  };

  const shouldShowLoadMore =
    movies.length > 0 && currentPage < totalPages && !loading;

  return (
    <main className={css.container}>
      <SearchBar onSearch={handleSearch} />

      {hasSearched &&
        (movies.length > 0 ? (
          <MovieList movies={movies} />
        ) : (
          <div className={css.error}>Not found!</div>
        ))}

      {shouldShowLoadMore && <LoadMoreBtn onClick={loadMoreMovies} />}

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      <Toaster position="top-right" reverseOrder={false} />
    </main>
  );
};

export default MoviesPage;
