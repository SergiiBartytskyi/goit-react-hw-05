import { createSlice } from "@reduxjs/toolkit";
import {
  fetchMovieCast,
  fetchMovieDetails,
  fetchMovieReviews,
  fetchTrendingMovies,
  searchMovies,
} from "./operations";

const handlePending = (state) => {
  state.loading = true;
};

const handleRejected = (state, actions) => {
  state.loading = false;
  state.error = actions.payload;
};

const slice = createSlice({
  name: "movies",
  initialState: {
    items: [],
    totalPages: 0,
    movieDetails: null,
    cast: [],
    reviews: [],
    loading: false,
    error: null,
    hasSearched: false,
  },
  reducers: {
    clearMovies: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingMovies.pending, handlePending)
      .addCase(fetchTrendingMovies.fulfilled, (state, actions) => {
        state.loading = false;
        state.error = null;
        state.items = actions.payload;
      })
      .addCase(fetchTrendingMovies.rejected, handleRejected)
      .addCase(searchMovies.pending, handlePending)
      .addCase(searchMovies.fulfilled, (state, actions) => {
        state.loading = false;
        state.error = null;
        state.items.push(actions.payload.results);
        state.totalPages = actions.payload.totalPages;
        state.hasSearched = true;
      })
      .addCase(searchMovies.rejected, handleRejected)
      .addCase(fetchMovieDetails.pending, handlePending)
      .addCase(fetchMovieDetails.fulfilled, (state, actions) => {
        state.loading = false;
        state.error = null;
        state.movieDetails = actions.payload;
      })
      .addCase(fetchMovieDetails.rejected, handleRejected)
      .addCase(fetchMovieCast.pending, handlePending)
      .addCase(fetchMovieCast.fulfilled, (state, actions) => {
        state.loading = false;
        state.error = null;
        state.cast = actions.payload;
      })
      .addCase(fetchMovieCast.rejected, handleRejected)
      .addCase(fetchMovieReviews.pending, handlePending)
      .addCase(fetchMovieReviews.fulfilled, (state, actions) => {
        state.loading = false;
        state.error = null;
        state.reviews = actions.payload;
      })
      .addCase(fetchMovieReviews.rejected, handleRejected);
  },
});

export const { clearMovies } = slice.actions;

export const selectMovies = (state) => state.movies.items;
export const selectTotalPages = (state) => state.movies.totalPages;
export const selectMovieDetails = (state) => state.movies.movieDetails;
export const selectMovieCast = (state) => state.movies.cast;
export const selectMovieReviews = (state) => state.movies.reviews;
export const selectMoviesLoading = (state) => state.movies.loading;
export const selectMoviesError = (state) => state.movies.error;
export const selectMoviesSearched = (state) => state.movies.hasSearched;

export default slice.reducer;
