import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoManSharp, IoWomanSharp } from "react-icons/io5";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { IMovieCastMember } from "../../hooks";
import { fetchMovieCast } from "../../fetchTMDB";
import css from "./MovieCast.module.css";

const MovieCast = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [cast, setCast] = useState<IMovieCastMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getCast = async () => {
      if (!movieId) {
        setError("Movie ID is not available.");
        return;
      }

      const numericMovieId = parseInt(movieId, 10);

      try {
        setLoading(true);
        setError(null);
        const movieCast = await fetchMovieCast(numericMovieId, { signal });
        setCast(movieCast.cast);
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

    getCast();

    return () => {
      controller.abort();
    };
  }, [movieId]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {cast.length > 0 ? (
        <ul className={css.container}>
          {cast.map(({ character, name, profile_path, id, gender }) => (
            <li key={id}>
              <div className={css.wrapper}>
                {profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w92/${profile_path}`}
                    alt={name}
                  />
                ) : (
                  <div className={css.empty}>
                    {gender === 1 ? (
                      <IoWomanSharp className={css.icon} />
                    ) : (
                      <IoManSharp className={css.icon} />
                    )}
                  </div>
                )}
                <div className={css.info}>
                  <p className={css.text}>
                    <strong>Actor:</strong> {name}
                  </p>
                  <p className={css.text}>
                    <strong>Character:</strong> {character}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={css.error}>We don't have a cast list for this movie!</p>
      )}
    </div>
  );
};

export default MovieCast;
