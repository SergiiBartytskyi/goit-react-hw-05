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

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
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
      state.hasSearched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingMovies.pending, handlePending)
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = action.payload;
      })
      .addCase(fetchTrendingMovies.rejected, handleRejected)
      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
        state.hasSearched = true;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // state.items.push(action.payload.results);
        state.items = [...state.items, ...action.payload.results];
        // if (action.payload.results && action.payload.results.length > 0) {
        //   state.items = [...state.items, ...action.payload.results];
        // }
        state.totalPages = action.payload.totalPages;
      })
      .addCase(searchMovies.rejected, handleRejected)
      .addCase(fetchMovieDetails.pending, handlePending)
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.movieDetails = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, handleRejected)
      .addCase(fetchMovieCast.pending, handlePending)
      .addCase(fetchMovieCast.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.cast = action.payload;
      })
      .addCase(fetchMovieCast.rejected, handleRejected)
      .addCase(fetchMovieReviews.pending, handlePending)
      .addCase(fetchMovieReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.reviews = action.payload;
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
