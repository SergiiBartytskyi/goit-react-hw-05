import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import moviesReducer from "./movies/moviesSlice";
import queryReducer from "./query/querySlice";

const authPersistConfig = {
  key: "movies",
  storage,
  whitelist: ["movies"],
};

export const store = configureStore({
  reducer: {
    movies: persistReducer(authPersistConfig, moviesReducer),
    query: queryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV === "development",
});

export const persistor = persistStore(store);
