import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchBooksThunk, fetchSuggestionsThunk  } from './booksThunks';

interface Book {
  id: string;
  title: string;
  author_name: string[];
}

interface BooksState {
  books: Book[];
  suggestions: { title: string; authors: string }[];
  booksLoading: boolean;
  suggestionsLoading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  books: [],
  suggestions: [],
  booksLoading: false,
  suggestionsLoading: false,
  error: null,
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setSuggestions(state, action: PayloadAction<{ title: string; authors: string }[]>) {
      state.suggestions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooksThunk.pending, (state) => {
        state.booksLoading = true;
        state.error = null;
      })
      .addCase(fetchBooksThunk.fulfilled, (state, action) => {
        state.books = action.payload.docs;
        state.booksLoading = false;
      })
      .addCase(fetchBooksThunk.rejected, (state, action) => {
        state.booksLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSuggestionsThunk.pending, (state) => {
        state.suggestionsLoading = true;
        state.error = null;
      })
      .addCase(fetchSuggestionsThunk.fulfilled, (state, action) => {
        state.suggestions = action.payload.docs.map((book: Book) => ({
          title: book.title,
          authors: book.author_name ? book.author_name.join(', ') : 'Unknown Author'
        }));
        state.suggestionsLoading = false;
      })
      .addCase(fetchSuggestionsThunk.rejected, (state, action) => {
        state.error = action.payload as string;
        state.suggestionsLoading = false;

      })
  },
});

export const { setSuggestions } = booksSlice.actions;
export default booksSlice.reducer;
