import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YmI2Y2JjOWRlMDE3MjhjMTI1MGI0NjhlNWZmZGE5NSIsIm5iZiI6MTcyNDU0ODg5OS4wOTY3OCwic3ViIjoiNjYzOGJlZmVjOTA1NGYwMTJhOTE0ZTZiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.uRKGHt-G275vGj2yyXMxDTemRdDZQ8D8ZonoeaxsG6g",
  },
});

export const fetchTrendingMovies = createAsyncThunk(
  "movies/fetchTrendingMovies",
  async (_, thunkAPI) => {
    try {
      const response = (await instance.get("/trending/movie/day")).data;
      return response.results;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const searchMovies = createAsyncThunk(
  "movies/searchMovies",
  async ({ query, page = 1 }, thunkAPI) => {
    try {
      const response = (
        await instance.get("/search/movie", {
          params: {
            query,
            page,
            page_size: 20,
          },
        })
      ).data;
      return {
        results: response.results,
        totalPages: response.total_pages,
      };
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const fetchMovieDetails = createAsyncThunk(
  "movies/fetchMovieDetails",
  async (movie_id, thunkAPI) => {
    try {
      const response = (await instance.get(`/movie/${movie_id}`)).data;
      return {
        poster_path: response.poster_path,
        title: response.title,
        release_date: response.release_date,
        vote_average: response.vote_average,
        overview: response.overview,
        genres: response.genres,
      };
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const fetchMovieCast = createAsyncThunk(
  "movies/fetchMovieCast",
  async (movie_id, thunkAPI) => {
    try {
      const response = (
        await instance.get(`/movie/${movie_id}/credits`, {
          params: {
            movie_id,
          },
        })
      ).data;
      return response.cast;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const fetchMovieReviews = createAsyncThunk(
  "movies/fetchMovieReviews",
  async (movie_id, thunkAPI) => {
    try {
      const response = (
        await instance.get(`/movie/${movie_id}/reviews`, {
          params: {
            movie_id,
          },
        })
      ).data;
      return response.results;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);
