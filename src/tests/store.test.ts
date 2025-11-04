import { describe, it, expect } from 'vitest';
import store from '../redux/store';
import { fetchBooksThunk } from '../redux/books/booksThunks';

describe('Store Test', () => {
  it('should handle fetchBooksThunk correctly', async () => {
    const result = await store.dispatch(fetchBooksThunk({ query: 'react' }));
    expect(result).toHaveProperty('type', 'search/fetchBooks/fulfilled');
  });
});
