import { describe, it, expect } from 'vitest';
import suggestionsReducer, { SuggestionsState } from '../redux/books/suggestionsSlice';
import { fetchSuggestionsThunk } from '../redux/books/booksThunks';

const initialState: SuggestionsState = {
  suggestions: [],
  suggestionsLoading: false,
  error: null,
  selectedSuggestion: null,
};

describe('booksSlice reducer', () => {

  it('should return the correct initial state when called with undefined state or action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const resultState = suggestionsReducer(undefined, action)

    expect(resultState.suggestions).toEqual([])
    expect(resultState.suggestionsLoading).toBe(false)
    expect(resultState.error).toBe(null)
  });

  it('should set suggestionsLoading to true and error to null on fetchSuggestionsThunk.pending', () => {
    const action = { type: fetchSuggestionsThunk.pending.type };
    const state = suggestionsReducer(initialState, action);
    expect(state.suggestionsLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should update books and set loading to false on fetchSuggestionsThunk.fulfilled', () => {
    const mockSuggestions = [
      { id: '1', title: 'Book 1', author_name: ['Author 1'] },
      { id: '2', title: 'Book 2', author_name: ['Author 2'] }
    ];
    const action = { type: fetchSuggestionsThunk.fulfilled.type, payload: { docs: mockSuggestions }};
    const state = suggestionsReducer(initialState, action);

    const expectedSuggestions = mockSuggestions;

    expect(state.suggestions).toEqual(expectedSuggestions);
    expect(state.suggestionsLoading).toBe(false);
  });
});
