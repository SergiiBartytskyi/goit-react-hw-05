import { useEffect, useState } from "react";
import MovieList from "../../components/MovieList/MovieList";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { fetchTrendingMovies } from "../../fetchTMDB";
import { IMovie } from "../../types";
import css from "./HomePage.module.css";

const HomePage = () => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchMovies = async () => {
      try {
        setError(null);
        setLoading(true);
        const trendingMovies = await fetchTrendingMovies({ signal });
        setMovies(trendingMovies);
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
  }, []);

  if (loading) return <Loader />;

  return (
    <main>
      <h1 className={css.title}>Trending today</h1>
      <MovieList movies={movies} />
      {error && <ErrorMessage message={error} />}
    </main>
  );
};
export default HomePage;
