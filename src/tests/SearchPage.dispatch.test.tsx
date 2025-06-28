import React from "react";
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react'; // waitFor von RTL
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi, beforeEach } from 'vitest'; // afterEach für Timer nicht mehr nötig

import searchReducer from '../redux/books/searchSlice';
import suggestionsReducer from '../redux/books/suggestionsSlice';
import SearchPage from '../components/SearchListPage/SearchListPage';
import * as booksThunks from '../redux/books/booksThunks';

vi.mock('../redux/books/booksThunks');

describe('SearchPage Component - Dispatching Actions', () => {
  const mockedFetchBooksThunk = vi.mocked(booksThunks.fetchBooksThunk);
  const mockedFetchSuggestionsThunk = vi.mocked(booksThunks.fetchSuggestionsThunk);

  beforeEach(() => {
    vi.clearAllMocks();
     // TODO: Find a more type-safe way to mock the thunk action creator's return value
    mockedFetchBooksThunk.mockReturnValue(vi.fn(() => Promise.resolve({ meta: {}, payload: {} })) as never);
    mockedFetchSuggestionsThunk.mockReturnValue(vi.fn(() => Promise.resolve({ meta: {}, payload: {} })) as never);
  });

  // Test 1 (funktionierte schon, keine Timer involviert)
  it('should call fetchBooksThunk action creator with the correct query when search button is clicked', async () => {
    const user = userEvent.setup(); // KEINE Timer-Optionen hier
    const store = configureStore({
      reducer: {
        search: searchReducer,
        suggestions: suggestionsReducer
      }
    });
    render(<Provider store={store}><SearchPage /></Provider>);
    const input = screen.getByPlaceholderText('Search for books or authors');
    const button = screen.getByRole('button', { name: /search/i });
    const searchTerm = 'React';

    console.log('[TEST 1] Before user.type');
    await user.type(input, searchTerm);
    console.log('[TEST 1] After user.type');
    await user.click(button);
    console.log('[TEST 1] After user.click');

    // Da der Thunk asynchron ist, ist waitFor hier immer noch eine gute Idee
    await waitFor(() => {
      expect(mockedFetchBooksThunk).toHaveBeenCalledTimes(1);
    });
    expect(mockedFetchBooksThunk).toHaveBeenCalledWith(searchTerm);
    console.log('[TEST 1] Assertions passed');
  });

  // Test 2 (OHNE Fake-Timer, mit echtem Debounce-Delay)
  describe('when typing for suggestions', () => {
      // KEINE Fake-Timer beforeEach/afterEach hier

      it('should call fetchSuggestionsThunk after debounce when user types', async () => {
        const user = userEvent.setup(); // KEINE Timer-Optionen hier
        const store = configureStore({
          reducer: {
            search: searchReducer,
            suggestions: suggestionsReducer
          }
        });
        render(
          <Provider store={store}>
            <SearchPage />
          </Provider>
        );
        const input = screen.getByPlaceholderText('Search for books or authors') as HTMLInputElement;
        const searchTerm = 'Redux';

        console.log('[TEST 2] Before user.type');
        await user.type(input, searchTerm);
        expect(input.value).toBe('Redux');
        console.log('[TEST 2] After user.type, input.value:', input.value);

        // Wir müssen jetzt auf den echten Debounce-Delay warten.
        // waitFor wird die Bedingung wiederholt prüfen, bis sie erfüllt ist oder das Timeout erreicht.
        // Das Timeout von waitFor muss länger sein als der Debounce-Delay.
        await waitFor(() => {
            console.log('[TEST 2] Inside waitFor, mockedFetchSuggestionsThunk call count:', mockedFetchSuggestionsThunk.mock.calls.length);
            expect(mockedFetchSuggestionsThunk).toHaveBeenCalledTimes(1);
        }, { timeout: 1000 }); // Timeout für waitFor (z.B. 1000ms, da Debounce 500ms ist)

        expect(mockedFetchSuggestionsThunk).toHaveBeenCalledWith(searchTerm);
        console.log('[TEST 2] Assertions passed');
      }, 7000); // Timeout für den gesamten it-Block (sollte reichen)
  });
});
