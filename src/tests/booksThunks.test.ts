import { describe, it, expect, vi } from 'vitest';
import store from '../redux/store';
import { fetchBooksThunk, fetchSuggestionsThunk } from '../redux/books/booksThunks';
import { fetchBooks, fetchSuggestions } from '../API/api';

type VitestMock = ReturnType<typeof vi.fn>;

vi.mock('../API/api', () => ({
  fetchBooks: vi.fn(),
  fetchSuggestions: vi.fn(),
}));

describe('fetchBooksThunk', () => {
  it('dispatches fulfilled action when API call is successful', async () => {
    const mockBooks = [
      { id: '1', title: 'Book 1', author_name: ['Author 1'] },
      { id: '2', title: 'Book 2', author_name: ['Author 2'] }
    ];
    (fetchBooks as unknown as VitestMock).mockResolvedValue({ docs: mockBooks });

    const action = await store.dispatch(fetchBooksThunk('react'));

    expect(action.type).toBe('books/fetchBooks/fulfilled');
    expect(action.payload).toEqual({ docs: mockBooks });
  });

  it('dispatches rejected action when API call fails', async () => {
    const errorMessage = 'Network error';
    (fetchBooks as unknown as VitestMock).mockRejectedValue(new Error(errorMessage));

    const action = await store.dispatch(fetchBooksThunk('react'));

    expect(action.type).toBe('books/fetchBooks/rejected');
    expect(action.payload).toEqual(expect.any(String));
  });
});

describe('fetchSuggestionsThunk', () => {
  it('dispatches fulfilled action when API call is successful', async () => {
    const mockSuggestions = [
      { title: 'React Basics', author_name: ['Author 1'] },
      { title: 'Advanced React', author_name: ['Author 2'] }
    ];
    (fetchSuggestions as unknown as VitestMock).mockResolvedValue(mockSuggestions);

    const action = await store.dispatch(fetchSuggestionsThunk('react'));

    expect(action.type).toBe('books/fetchSuggestions/fulfilled');
    expect(action.payload).toEqual({ docs: mockSuggestions });
  });

  it('dispatches rejected action when API call fails', async () => {
    const errorMessage = 'API error';
    (fetchSuggestions as unknown as VitestMock).mockRejectedValue(new Error(errorMessage));

    const action = await store.dispatch(fetchSuggestionsThunk('react'));

    expect(action.type).toBe('books/fetchSuggestions/rejected');
    expect(action.payload).toEqual(expect.any(String));
  });
});
