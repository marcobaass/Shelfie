import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchSuggestionsThunk, fetchBookDetailsThunk } from './booksThunks';
import { Book, RawApiDoc } from './bookTypes';

export interface SuggestionsState {
  suggestions: Book[];
  suggestionsLoading: boolean;
  error: string | null;
  selectedSuggestion: Book | null;
  showSuggestions: boolean;
  detailsLoading: boolean;
  detailedBook: RawApiDoc | null;
}

const initialState: SuggestionsState = {
  suggestions: [],
  suggestionsLoading: false,
  error: null,
  selectedSuggestion: null,
  showSuggestions: false,
  detailsLoading: false,
  detailedBook: null,
};

const suggestionsSlice = createSlice({
  name: 'suggestions',
  initialState,
  reducers: {
    setShowSuggestions: (state, action:  PayloadAction<boolean>) => {
      state.showSuggestions = action.payload;
    },
    setSuggestions(state, action: PayloadAction<Book[]>) {
      state.suggestions = action.payload;
    },
    setSelectedSuggestion(state, action: PayloadAction<Book | null>) {
      state.selectedSuggestion = action.payload;
    },
    clearSuggestions: (state) => {state.suggestions = []}
  },
  extraReducers: (builder) => {
    builder
      // the state for fetchSuggestionsThunk
      .addCase(fetchSuggestionsThunk.pending, (state) => {
        state.suggestionsLoading = true;
        state.error = null;
      })
      .addCase(fetchSuggestionsThunk.fulfilled, (state, action) => {
        state.suggestions = action.payload.docs;
        state.suggestionsLoading = false;
      })
      .addCase(fetchSuggestionsThunk.rejected, (state, action) => {
        state.error = typeof action.payload === 'string'
                       ? action.payload
                       : 'Failed to fetch suggestions';
        state.suggestionsLoading = false;
      })

      // new cases for fetchBookDetailsThunk
      .addCase(fetchBookDetailsThunk.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchBookDetailsThunk.fulfilled, (state, action) => {
        state.detailedBook = action.payload;
        state.detailsLoading = false
      })
      .addCase(fetchBookDetailsThunk.rejected, (state, action) => {
        // The thunk's rejectValue guarantees a string payload
        state.error = action.payload as string;
        state.detailsLoading = false;
      })
  },
});

export const { setSuggestions, setSelectedSuggestion, setShowSuggestions, clearSuggestions } = suggestionsSlice.actions;
export default suggestionsSlice.reducer;
