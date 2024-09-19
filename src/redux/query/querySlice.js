import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "query",
  initialState: {
    query: "",
  },
  reducers: {
    addQuery: (state, actions) => {
      state.query = actions.payload;
    },
  },
});

export const selectQuery = (state) => state.query.query;

export const { addQuery } = slice.actions;

export default slice.reducer;
