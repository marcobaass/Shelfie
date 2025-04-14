// src/tests/booksThunks.test.ts
import { describe, it, expect, vi, afterEach } from 'vitest';
import store from '../redux/store';
import { fetchBooksThunk, fetchSuggestionsThunk } from '../redux/books/booksThunks';
import { fetchBooks, fetchSuggestions } from '../API/api';

type VitestMock = ReturnType<typeof vi.fn>;

// Mock the API module so both functions can be controlled in tests.
vi.mock('../API/api', () => ({
  fetchBooks: vi.fn(),
  fetchSuggestions: vi.fn(),
}));

describe('fetchBooksThunk', () => {

  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  })

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

  afterEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
  })

  it('dispatches fulfilled action when API call is successful', async () => {
    // Mock data with simple key properties that match what the test expects
    const mockData = [
      {
        key: "1", // Simple key format for the test
        title: "Book 1",
        author_name: ["Author 1"],
        cover_i: 111,
        first_publish_year: 1990,
        synopsis: "No synopsis available"
      },
      {
        key: "2", // Simple key format for the test
        title: "Book 2",
        author_name: ["Author 2"],
        cover_i: 222,
        first_publish_year: 2000,
        synopsis: "No synopsis available"
      }
    ];

    // Mock the API response
    (fetchSuggestions as unknown as VitestMock).mockResolvedValue(mockData);

    // Dispatch the thunk
    const action = await store.dispatch(fetchSuggestionsThunk('test query'));

    // Define expected data after mapping - should match exactly what the test expects
    const expectedMappedSuggestions = [
      {
        id: "1",
        title: "Book 1",
        author_name: ["Author 1"],
        cover: 111,
        year: 1990,
        synopsis: "No synopsis available"
      },
      {
        id: "2",
        title: "Book 2",
        author_name: ["Author 2"],
        cover: 222,
        year: 2000,
        synopsis: "No synopsis available"
      }
    ];

    // Assert that the action has the correct type and payload
    expect(action.type).toBe('books/fetchSuggestions/fulfilled');
    expect(action.payload).toEqual({ docs: expectedMappedSuggestions });
  });

  it('dispatches rejected action when API call fails', async () => {
    const errorMessage = 'Network error';
    (fetchSuggestions as unknown as VitestMock).mockRejectedValue(new Error(errorMessage));

    const action = await store.dispatch(fetchSuggestionsThunk('react'));
    expect(action.type).toBe('books/fetchSuggestions/rejected');
    expect(action.payload).toEqual(expect.any(String));
  });
});
