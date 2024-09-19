// import { useEffect, useState } from "react";
// import MovieList from "../../components/MovieList/MovieList";
// import Loader from "../../components/Loader/Loader";
// import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
// import { fetchTrendingMovies } from "../../fetchTMDB";
// import css from "./HomePage.module.css";

// const HomePage = () => {
//   const [movies, setMovies] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     const controller = new AbortController();
//     const signal = controller.signal;

//     const fetchMovies = async () => {
//       try {
//         setError(false);
//         setLoading(true);
//         const trendingMovies = await fetchTrendingMovies({ signal });
//         setMovies(trendingMovies);
//       } catch (error) {
//         if (error.name !== "AbortError") {
//           setError(true);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMovies();

//     return () => {
//       controller.abort();
//     };
//   }, []);

//   if (loading) return <Loader />;
//   if (error) return <ErrorMessage />;

//   return (
//     <main>
//       <h1 className={css.title}>Trending today</h1>
//       <MovieList movies={movies} />
//     </main>
//   );
// };
// export default HomePage;

//-----------------------

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MovieList from "../../components/MovieList/MovieList";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { fetchTrendingMovies } from "../../redux/movies/operations";
import css from "./HomePage.module.css";
import {
  selectMoviesError,
  selectMoviesLoading,
} from "../../redux/movies/moviesSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectMoviesLoading);
  const error = useSelector(selectMoviesError);

  useEffect(() => {
    dispatch(fetchTrendingMovies());
  }, [dispatch]);

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <main>
      <h1 className={css.title}>Trending today</h1>
      <MovieList />
    </main>
  );
};
export default HomePage;
