import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchSuggestionsThunk  } from './booksThunks';
import { Book } from './bookTypes';

export interface SuggestionsState {
  suggestions: Book[];
  suggestionsLoading: boolean;
  error: string | null;
  selectedSuggestion: Book | null;
}

const initialState: SuggestionsState = {
  suggestions: [],
  suggestionsLoading: false,
  error: null,
  selectedSuggestion: null,
};

const suggestionsSlice = createSlice({
  name: 'suggestions',
  initialState,
  reducers: {
    setSuggestions(state, action: PayloadAction<Book[]>) {
      state.suggestions = action.payload;
    },
    setSelectedSuggestion(state, action: PayloadAction<Book | null>) {
      state.selectedSuggestion = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
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
  },
});

export const { setSuggestions, setSelectedSuggestion } = suggestionsSlice.actions;
export default suggestionsSlice.reducer;
