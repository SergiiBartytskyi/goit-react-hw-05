import axios, { AxiosResponse } from "axios";
import {
  IMovie,
  IMovieCast,
  IMovieReview,
  IMovieReviewsResponse,
  ISearchMoviesResponse,
  ITrendingMoviesResponse,
} from "./types";

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YmI2Y2JjOWRlMDE3MjhjMTI1MGI0NjhlNWZmZGE5NSIsIm5iZiI6MTcyNDU0ODg5OS4wOTY3OCwic3ViIjoiNjYzOGJlZmVjOTA1NGYwMTJhOTE0ZTZiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.uRKGHt-G275vGj2yyXMxDTemRdDZQ8D8ZonoeaxsG6g",
  },
});

const fetchTrendingMovies = async (options?: {
  signal?: AbortSignal;
}): Promise<IMovie[]> => {
  const response: AxiosResponse<ITrendingMoviesResponse> = await instance.get(
    "/trending/movie/day",
    {
      signal: options?.signal,
    }
  );
  return response.data.results;
};

const searchMovies = async (
  query: string,
  options: { signal?: AbortSignal; page?: number } = {}
): Promise<ISearchMoviesResponse> => {
  const { signal, page = 1 } = options;
  const response: AxiosResponse<ISearchMoviesResponse> = await instance.get(
    "/search/movie",
    {
      params: {
        query,
        page,
        page_size: 20,
      },
      signal,
    }
  );

  return {
    results: response.data.results,
    total_pages: response.data.total_pages,
  };
};

const fetchMovieDetails = async (
  movie_id: number,
  options: { signal?: AbortSignal } = {}
): Promise<IMovie> => {
  const response: AxiosResponse<IMovie> = await instance.get(
    `/movie/${movie_id}`,
    {
      signal: options?.signal,
    }
  );

  return {
    poster_path: response.data.poster_path,
    title: response.data.title,
    release_date: response.data.release_date,
    vote_average: response.data.vote_average,
    overview: response.data.overview,
    genres: response.data.genres,
  };
};

const fetchMovieCast = async (
  movie_id: number,
  options: { signal?: AbortSignal } = {}
): Promise<IMovieCast> => {
  const response: AxiosResponse<IMovieCast> = await instance.get(
    `/movie/${movie_id}/credits`,
    {
      signal: options.signal,
    }
  );

  return response.data;
};

const fetchMovieReviews = async (
  movie_id: number,
  options: { signal?: AbortSignal } = {}
): Promise<IMovieReview[]> => {
  const response: AxiosResponse<IMovieReviewsResponse> = await instance.get(
    `/movie/${movie_id}/reviews`,
    {
      signal: options.signal,
    }
  );

  return response.data.results;
};

export {
  fetchTrendingMovies,
  searchMovies,
  fetchMovieDetails,
  fetchMovieCast,
  fetchMovieReviews,
};
