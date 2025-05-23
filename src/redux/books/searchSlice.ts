import { createSlice } from '@reduxjs/toolkit';
import { fetchBooksThunk } from './booksThunks';
import { Book } from './bookTypes';

export interface BooksState {
  books: Book[];
  booksLoading: boolean;
  error: string | null;
  numFound: number;
}

const initialState: BooksState = {
  books: [],
  booksLoading: false,
  error: null,
  numFound: 0,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooksThunk.pending, (state) => {
        state.booksLoading = true;
        state.error = null;
      })
      .addCase(fetchBooksThunk.fulfilled, (state, action) => {
        state.books = action.payload.docs;
        if (action.payload.numFound !== undefined) {
          state.numFound = action.payload.numFound;
        }
        state.booksLoading = false;
      })
      .addCase(fetchBooksThunk.rejected, (state, action) => {
        state.booksLoading = false;
        state.error = action.payload as string;
      })
  },
});

export default searchSlice.reducer;
