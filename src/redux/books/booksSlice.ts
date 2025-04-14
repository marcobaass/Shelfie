import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchBooksThunk, fetchSuggestionsThunk  } from './booksThunks';

export interface Book {
  id: string;
  title: string;
  author_name: string[];
  cover?: number;
  year?: number;
  synopsis?: string;
}

export interface BooksState {
  books: Book[];
  suggestions: Book[];
  booksLoading: boolean;
  suggestionsLoading: boolean;
  error: string | null;
  selectedSuggestion: Book | null;
}

const initialState: BooksState = {
  books: [],
  suggestions: [],
  booksLoading: false,
  suggestionsLoading: false,
  error: null,
  selectedSuggestion: null,
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setSuggestions(state, action: PayloadAction<Book[]>) {
      state.suggestions = action.payload;
    },
    setSelectedSuggestion(state, action: PayloadAction<Book | null>) {
      console.log("Dispatching setSelectedSuggestion with:", action.payload);
      state.selectedSuggestion = action.payload;
    }
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
        console.log("Suggestions Payload:", action.payload);
        state.suggestions = action.payload.docs;
        state.suggestionsLoading = false;
      })
      .addCase(fetchSuggestionsThunk.rejected, (state, action) => {
        state.error = action.payload as string;
        state.suggestionsLoading = false;

      })
  },
});

export const { setSuggestions, setSelectedSuggestion } = booksSlice.actions;
export default booksSlice.reducer;
