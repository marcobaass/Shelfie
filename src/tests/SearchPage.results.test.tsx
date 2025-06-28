import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react'; // act hier nicht unbedingt nötig
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi, beforeEach } from 'vitest'; // afterEach für Timer nicht mehr nötig

import searchReducer from '../redux/books/searchSlice';
import suggestionsReducer from '../redux/books/suggestionsSlice'
import { Book } from '../redux/books/bookTypes';
import SearchPage from '../components/SearchListPage/SearchListPage';
import { fetchBooks, fetchSuggestions } from '../API/api';

vi.mock('../API/api');

const mockBookData: Book[] = [
  { id: '1', title: 'React Testing For Beginners', author_name: ['John Doe'] },
  { id: '2', title: 'Advanced React Patterns', author_name: ['Jane Smith'] },
];
const mockApiResponse = { docs: mockBookData, numFound: mockBookData.length };
const mockSuggestionsApiResponse = { docs: [{id: 's1', title: 'React Suggestion', author_name: ['Dev']}], numFound: 1 }; // author_name hinzugefügt

describe('SearchPage Component - Displaying Results', () => {
  let user: ReturnType<typeof userEvent.setup>; // user wird im beforeEach gesetzt

  const mockedFetchBooks = vi.mocked(fetchBooks);
  const mockedFetchSuggestions = vi.mocked(fetchSuggestions);

  beforeEach(() => {
    // KEINE Fake-Timer hier
    user = userEvent.setup(); // Einfaches Setup
    vi.clearAllMocks();
    mockedFetchBooks.mockResolvedValue(mockApiResponse);
    mockedFetchSuggestions.mockResolvedValue(mockSuggestionsApiResponse);
  });

  // KEIN afterEach für Timer-Cleanup hier

  it('should display book results after a successful search', async () => {
    console.log('[Results Test] Test started');

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
    const input = screen.getByPlaceholderText(/search/i) as HTMLInputElement; // Für .value
    const button = screen.getByRole('button', { name: /search/i });
    const searchTerm: string = 'React';

    console.log('[Results Test] Before user.type');
    await user.type(input, searchTerm);
    expect(input.value).toBe('React'); // Schneller Check, ob Tippen funktioniert
    console.log('[Results Test] After user.type, input value:', input.value);

    // Erwarte, dass fetchSuggestions nach dem Debounce aufgerufen wird
    // waitFor gibt dem 500ms Debounce + API-Mock-Zeit + Render-Zeit
    await waitFor(() => {
      console.log('[Results Test] Inside waitFor for mockedFetchSuggestions. Call count:', mockedFetchSuggestions.mock.calls.length);
      expect(mockedFetchSuggestions).toHaveBeenCalled();
    }, { timeout: 1000 }); // Timeout für diesen waitFor, sollte > 500ms sein
    // Optional: Prüfe, ob es mit dem richtigen Begriff aufgerufen wurde
    // expect(mockedFetchSuggestions).toHaveBeenCalledWith(searchTerm);
    console.log('[Results Test] mockedFetchSuggestions assertion passed or timed out');

    console.log('[Results Test] Before user.click button');
    await user.click(button); // Löst fetchBooksThunk aus
    console.log('[Results Test] After user.click button');

    // Erwarte, dass fetchBooks aufgerufen wurde
    await waitFor(() => {
      console.log('[Results Test] Inside waitFor for mockedFetchBooks. Call count:', mockedFetchBooks.mock.calls.length);
      expect(mockedFetchBooks).toHaveBeenCalledTimes(1);
      expect(mockedFetchBooks).toHaveBeenCalledWith(searchTerm);
    }, { timeout: 1000 }); // Timeout für diesen waitFor
    console.log('[Results Test] mockedFetchBooks assertion passed or timed out');

    // Erwarte, dass die Ergebnisse (aus mockApiResponse für fetchBooks) im DOM erscheinen
    console.log('[Results Test] Before findByText for book results');
    expect(await screen.findByText('React Testing For Beginners', {}, { timeout: 3000 })).toBeInTheDocument();
    expect(await screen.findByText('Advanced React Patterns', {}, { timeout: 3000 })).toBeInTheDocument();
    console.log('[Results Test] Test finished assertions');
  }); // Gesamttest-Timeout (vorher 15000, 10000 sollte reichen)
});
