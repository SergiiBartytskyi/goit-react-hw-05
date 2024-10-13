import { useRef, useState, useEffect, Suspense } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  Outlet,
  NavLink,
} from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { fetchMovieDetails } from "../../fetchTMDB";
import { BiSolidCameraMovie } from "react-icons/bi";
import clsx from "clsx";
import css from "./MovieDetailsPage.module.css";
import { IIsActiveProps, IMovie } from "../../types";

const buildLinkClass = ({ isActive }: IIsActiveProps) => {
  return clsx(css.link, isActive && css.active);
};

const MovieDetailsPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<IMovie | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const backLinkHref = useRef(location.state ?? "/movies");

  const onClickBack = () => navigate(backLinkHref.current);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getMovie = async () => {
      if (!movieId) {
        setError("Movie ID is not available.");
        return;
      }

      const numericMovieId = parseInt(movieId, 10);

      try {
        setLoading(true);
        setError(null);
        setMovie(null);
        const movieDetails = await fetchMovieDetails(numericMovieId, {
          signal,
        });
        setMovie(movieDetails);
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

    getMovie();

    return () => {
      controller.abort();
    };
  }, [movieId]);

  if (!movie) {
    return <Loader />;
  }

  const { title, release_date, poster_path, vote_average, overview, genres } =
    movie;
  const releaseYear = new Date(release_date).getFullYear() || "-";
  const titleWithYear = `${title} (${releaseYear})`;

  return (
    <main className={css.container}>
      <button onClick={onClickBack} className={css.btnBack}>
        Go back
      </button>

      <div className={css.wrapper}>
        {poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w300/${poster_path}`}
            alt={title}
          />
        ) : (
          <div className={css.empty}>
            <BiSolidCameraMovie className={css.icon} />
          </div>
        )}
        <div className={css.info}>
          <h1 className={css.title}>{titleWithYear}</h1>
          <p className={css.text}>
            User Score: {Math.round(vote_average * 10)}%
          </p>
          <h2 className={css.subTitle}>Overview</h2>
          <p className={css.text}>{overview}</p>
          <h2 className={css.subTitle}>Genres</h2>
          {genres.length > 0 ? (
            <p className={css.text}>
              {genres.map((genre) => genre.name).join(" ")}
            </p>
          ) : (
            <p className={css.text}>
              We don't have a genre list for this movie!
            </p>
          )}
        </div>
      </div>
      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      <hr />

      <p className={css.text}>Additional information</p>

      <ul className={css.addInfo}>
        <li className={css.addInfoLink}>
          <NavLink to="cast" className={buildLinkClass}>
            Cast
          </NavLink>
        </li>
        <li>
          <NavLink to="reviews" className={buildLinkClass}>
            Reviews
          </NavLink>
        </li>
      </ul>
      <hr />
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </main>
  );
};

export default MovieDetailsPage;
