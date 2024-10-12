import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { fetchMovieReviews } from "../../fetchTMDB";
import { IMovieReview } from "../../hooks";
import css from "./MovieReviews.module.css";

const MovieReviews = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [reviews, setReviews] = useState<IMovieReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getReviews = async () => {
      if (!movieId) {
        setError("Movie ID is not available.");
        return;
      }

      const numericMovieId = parseInt(movieId, 10);

      try {
        setLoading(true);
        setError(null);
        const movieReviews = await fetchMovieReviews(numericMovieId, {
          signal,
        });
        setReviews(movieReviews);
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

    getReviews();

    return () => {
      controller.abort();
    };
  }, [movieId]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {reviews.length > 0 ? (
        <ul className={css.container}>
          {reviews.map((review) => (
            <li key={review.id}>
              <p>
                <strong className={css.text}>{review.author}</strong>
              </p>
              <p className={css.text}>{review.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className={css.error}>We don't have any reviews for this movie!</p>
      )}
    </div>
  );
};

export default MovieReviews;
