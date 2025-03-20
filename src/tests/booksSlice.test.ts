import { describe, it, expect } from 'vitest';
import booksReducer, { BooksState } from '../redux/books/booksSlice';
import { fetchBooksThunk } from '../redux/books/booksThunks';

const initialState: BooksState = {
  books: [],
  loading: false,
  error: null
};

describe('booksSlice reducer', () => {
  it('should set loading to true and error to null on fetchBooksThunk.pending', () => {
    const action = { type: fetchBooksThunk.pending.type };
    const state = booksReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should update books and set loading to false on fetchBooksThunk.fulfilled', () => {
    const mockBooks = [
      { id: '1', title: 'Book 1', author: 'Author 1' },
      { id: '2', title: 'Book 2', author: 'Author 2' }
    ];
    const action = { type: fetchBooksThunk.fulfilled.type, payload: { docs: mockBooks }};
    const state = booksReducer(initialState, action);
    expect(state.books).toEqual(mockBooks);
    expect(state.loading).toBe(false);
  });

  it('should set error and loading to false on fetchBooksThunk.rejected', () => {
    const errorMessage = 'Network error';
    const action = { type: fetchBooksThunk.rejected.type, payload: errorMessage };
    const state = booksReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
