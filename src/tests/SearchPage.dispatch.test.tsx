import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import SearchPage from '../components/SearchListPage/SearchListPage';
import * as booksThunks from '../redux/books/booksThunks';

import { MemoryRouter } from "react-router-dom";

vi.mock('../redux/books/booksThunks');
vi.mock('react-redux');
import * as rrd from 'react-redux';

describe('SearchPage Component - Dispatching Actions', () => {
  const mockedFetchBooksThunk = vi.mocked(booksThunks.fetchBooksThunk);
  const mockedFetchSuggestionsThunk = vi.mocked(booksThunks.fetchSuggestionsThunk);

  const mockedUseDispatch = vi.mocked(rrd.useDispatch);
  const mockedUseSelector = vi.mocked(rrd.useSelector);

  let dispatchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    dispatchMock = vi.fn();

    mockedUseDispatch.mockReturnValue(dispatchMock);

    mockedUseSelector.mockImplementation((selector) => {
      const defaultState = {
        search: { query: '', results: [], status: 'idle', error: null },
        suggestions: { query: '', suggestions: [], status: 'idle', error: null, showSuggestions: false, suggestionsLoading: false }
      };
      return selector(defaultState);
    });

    // Return proper action objects
    mockedFetchBooksThunk.mockReturnValue({
      type: 'books/fetchBooks/pending',
      payload: {},
      meta: { requestId: 'test' }
    } as never);

    mockedFetchSuggestionsThunk.mockReturnValue({
      type: 'books/fetchSuggestions/pending',
      payload: undefined,
      meta: { requestId: 'test' }
    } as never);
  });

  // Test 1: Focus on verifying the correct thunk is called, not dispatch count
  it('should call fetchBooksThunk action creator with the correct query when search button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Search for books or authors');
    const button = screen.getByRole('button', { name: /search/i });
    const searchTerm = 'React';

    console.log('[TEST 1] Before user.type');
    await user.type(input, searchTerm);
    console.log('[TEST 1] After user.type, dispatch calls:', dispatchMock.mock.calls.length);

    // Record the number of calls before clicking
    const callsBeforeClick = dispatchMock.mock.calls.length;

    await user.click(button);
    console.log('[TEST 1] After user.click, dispatch calls:', dispatchMock.mock.calls.length);
    console.log('[TEST 1] All dispatch calls:', dispatchMock.mock.calls);

    // Wait for any async operations
    await waitFor(() => {
      expect(dispatchMock.mock.calls.length).toBeGreaterThan(callsBeforeClick);
    });

    // Verify the fetchBooksThunk was called with correct argument
    expect(mockedFetchBooksThunk).toHaveBeenCalledWith(searchTerm);

    // Verify that at least one dispatch call was made with the books thunk
    const booksThunkCalls = dispatchMock.mock.calls.filter(call =>
      call[0]?.type === 'books/fetchBooks/pending'
    );
    expect(booksThunkCalls.length).toBeGreaterThanOrEqual(1);

    console.log('[TEST 1] Assertions passed');
  });

  // Test 2: Simplified debounce test without fake timers
  describe('when typing for suggestions', () => {
    it('should call fetchSuggestionsThunk when user types (with real timers)', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter>
          <SearchPage />
        </MemoryRouter>
      );

      const input = screen.getByPlaceholderText('Search for books or authors') as HTMLInputElement;
      const searchTerm = 'Redux';

      console.log('[TEST 2] Before user.type');
      await user.type(input, searchTerm);

      expect(input.value).toBe(searchTerm);
      console.log('[TEST 2] After user.type, input.value:', input.value);

      // Wait for debounce to complete (using real timers)
      await waitFor(() => {
        expect(mockedFetchSuggestionsThunk).toHaveBeenCalledWith(searchTerm);
      }, { timeout: 1000 }); // Give enough time for debounce

      console.log('[TEST 2] Assertions passed');
    });

    // Test debounce behavior - verify it doesn't trigger immediately
    it('should debounce suggestions calls when typing quickly', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter>
          <SearchPage />
        </MemoryRouter>
      );

      const input = screen.getByPlaceholderText('Search for books or authors') as HTMLInputElement;

      // Clear initial mocks
      vi.clearAllMocks();
      mockedFetchSuggestionsThunk.mockClear();

      // Type multiple characters quickly
      await user.type(input, 'R');
      await user.type(input, 'e');
      await user.type(input, 'a');
      await user.type(input, 'c');
      await user.type(input, 't');

      expect(input.value).toBe('React');

      // Wait for debounce to settle
      await waitFor(() => {
        expect(mockedFetchSuggestionsThunk).toHaveBeenCalledWith('React');
      }, { timeout: 1000 });

      // Should only be called once due to debouncing, not 5 times
      expect(mockedFetchSuggestionsThunk).toHaveBeenCalledTimes(1);
    });
  });

  // Test 3: Verify search button doesn't trigger suggestions
  it('should only call fetchBooksThunk when search button is clicked, not suggestions', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Search for books or authors') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /search/i });
    const searchTerm = 'Vue';

    // Type and wait for suggestions to settle
    await user.type(input, searchTerm);
    await waitFor(() => {
      expect(input.value).toBe(searchTerm);
    });

    // Clear mocks after typing
    vi.clearAllMocks();
    mockedFetchBooksThunk.mockClear();
    mockedFetchSuggestionsThunk.mockClear();

    // Click search button
    await user.click(button);

    // Wait for the search action
    await waitFor(() => {
      expect(mockedFetchBooksThunk).toHaveBeenCalledWith(searchTerm);
    });

    // Verify that only books thunk was called, not suggestions
    expect(mockedFetchBooksThunk).toHaveBeenCalledTimes(1);
    expect(mockedFetchSuggestionsThunk).not.toHaveBeenCalled();
  });
});
