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
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  books: [],
  suggestions: [],
  loading: false,
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooksThunk.fulfilled, (state, action) => {
        state.books = action.payload.docs;
        state.loading = false;
      })
      .addCase(fetchBooksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSuggestionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuggestionsThunk.fulfilled, (state, action) => {
        state.suggestions = action.payload.docs.map((book: Book) => ({
          title: book.title,
          authors: book.author_name ? book.author_name.join(', ') : 'Unknown Author'
        }));
      })
      .addCase(fetchSuggestionsThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })
  },
});

export const { setSuggestions } = booksSlice.actions;
export default booksSlice.reducer;
