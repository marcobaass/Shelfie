import { describe, it, expect } from 'vitest';
import searchReducer, { BooksState } from '../redux/books/searchSlice';
import { fetchBooksThunk } from '../redux/books/booksThunks';

const initialStateForSearchSliceTests: BooksState = {
  books: [],
  booksLoading: false,
  error: null,
  numFound: 0
};

describe('searchSlice reducer', () => {

  it('should return the correct initial state when called with undefined state or action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const resultState = searchReducer(undefined, action)

    expect(resultState.books).toEqual([]);
    expect(resultState.booksLoading).toBe(false);
    expect(resultState.error).toBe(null);
    expect(resultState.numFound).toBe(0);
  });

  it('should set booksLoading to true and error to null on fetchBooksThunk.pending', () => {
    const action = { type: fetchBooksThunk.pending.type };
    const state = searchReducer(initialStateForSearchSliceTests, action);
    expect(state.booksLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should update books and set loading to false on fetchBooksThunk.fulfilled', () => {
    const mockBooks = [
      { id: '1', title: 'Book 1', author_name: ['Author 1'] }, // author_name sollte ein Array sein gemäß deinem Book-Typ
      { id: '2', title: 'Book 2', author_name: ['Author 2'] }
    ];

    const mockNumFound = mockBooks.length;

    const action = {
      type: fetchBooksThunk.fulfilled.type,
      payload: { docs: mockBooks, numFound: mockNumFound }
    };
    const state = searchReducer(initialStateForSearchSliceTests, action);
    expect(state.books).toEqual(mockBooks);
    expect(state.numFound).toEqual(mockNumFound);
    expect(state.booksLoading).toBe(false);
  });

  it('should set error and booksLoading to false on fetchBooksThunk.rejected', () => {
    const errorMessage = 'Network error';
    const action = { type: fetchBooksThunk.rejected.type, payload: errorMessage };
    const state = searchReducer(initialStateForSearchSliceTests, action);
    expect(state.booksLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
