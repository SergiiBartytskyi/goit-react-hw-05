import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "query",
  initialState: {
    query: "",
  },
  reducers: {
    addQuery: (state, action) => {
      state.query = action.payload;
    },
  },
});

export const selectQuery = (state) => state.query.query;

export const { addQuery } = slice.actions;

export default slice.reducer;
