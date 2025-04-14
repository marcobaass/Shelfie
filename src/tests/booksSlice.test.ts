import { describe, it, expect } from 'vitest';
import booksReducer, { BooksState } from '../redux/books/booksSlice';
import { fetchBooksThunk, fetchSuggestionsThunk } from '../redux/books/booksThunks';

const initialState: BooksState = {
  books: [],
  suggestions: [],
  booksLoading: false,
  suggestionsLoading: false,
  error: null,
  selectedSuggestion: null,
};

describe('booksSlice reducer', () => {

  it('should return the correct initial state when called with undefined state or action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const resultState = booksReducer(undefined, action)

    expect(resultState.books).toEqual([])
    expect(resultState.suggestions).toEqual([])
    expect(resultState.booksLoading).toBe(false)
    expect(resultState.suggestionsLoading).toBe(false)
    expect(resultState.error).toBe(null)
  });

  it('should set booksLoading to true and error to null on fetchBooksThunk.pending', () => {
    const action = { type: fetchBooksThunk.pending.type };
    const state = booksReducer(initialState, action);
    expect(state.booksLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should update books and set loading to false on fetchBooksThunk.fulfilled', () => {
    const mockBooks = [
      { id: '1', title: 'Book 1', author_name: 'Author 1' },
      { id: '2', title: 'Book 2', author_name: 'Author 2' }
    ];
    const action = { type: fetchBooksThunk.fulfilled.type, payload: { docs: mockBooks }};
    const state = booksReducer(initialState, action);
    expect(state.books).toEqual(mockBooks);
    expect(state.booksLoading).toBe(false);
  });

  it('should set error and booksLoading to false on fetchBooksThunk.rejected', () => {
    const errorMessage = 'Network error';
    const action = { type: fetchBooksThunk.rejected.type, payload: errorMessage };
    const state = booksReducer(initialState, action);
    expect(state.booksLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should set suggestionsLoading to true and error to null on fetchSuggestionsThunk.pending', () => {
    const action = { type: fetchSuggestionsThunk.pending.type };
    const state = booksReducer(initialState, action);
    expect(state.suggestionsLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should update books and set loading to false on fetchSuggestionsThunk.fulfilled', () => {
    const mockSuggestions = [
      { id: '1', title: 'Book 1', author_name: ['Author 1'] },
      { id: '2', title: 'Book 2', author_name: ['Author 2'] }
    ];
    const action = { type: fetchSuggestionsThunk.fulfilled.type, payload: { docs: mockSuggestions }};
    const state = booksReducer(initialState, action);

    const expectedSuggestions = mockSuggestions;

    expect(state.suggestions).toEqual(expectedSuggestions);
    expect(state.suggestionsLoading).toBe(false);
  });
});
