import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit'
import { describe, it, expect, vi, beforeEach } from 'vitest';

import searchReducer from '../redux/books/searchSlice';
import suggestionsReducer from '../redux/books/suggestionsSlice'
// import { Book } from '../redux/books/bookTypes';
import SearchPage from '../components/SearchListPage/SearchListPage';
import { fetchBooks, fetchSuggestions } from '../API/api';
import { RawApiDoc } from '../redux/books/bookTypes';

import { MemoryRouter } from 'react-router-dom';

vi.mock('../API/api');

const mockRawDocs: RawApiDoc[] = [
  {
    key: "OL1M",
    title: "React Testing For Beginners",
    author_name: ["John Doe"], // or whatever the raw API shape uses
  },
  {
    key: "OL2M",
    title: "Advanced React Patterns",
    author_name: ["Jane Smith"],
  },
];

const mockApiResponse = {
  docs: mockRawDocs,
  numFound: mockRawDocs.length,
};

const mockSuggestionsApiResponse = [
  { id: 's1', title: 'React Suggestion', author_name: ['Dev'] }
];

describe('SearchPage Component - Displaying Results', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let store: ReturnType<typeof configureStore>;

  const mockedFetchBooks = vi.mocked(fetchBooks);
  const mockedFetchSuggestions = vi.mocked(fetchSuggestions);

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();

    store = configureStore({
      reducer: {
        search: searchReducer,
        suggestions: suggestionsReducer,
      },
  });

  mockedFetchBooks.mockResolvedValue(mockApiResponse);
  mockedFetchSuggestions.mockResolvedValue(mockSuggestionsApiResponse);
  });

  it('should display book results after a successful search', async () => {


    render(
      <Provider store={store}>
        <MemoryRouter>
          <SearchPage />
        </MemoryRouter>
      </Provider>
    );
    const input = screen.getByPlaceholderText(/search/i) as HTMLInputElement; // Für .value
    const button = screen.getByRole('button', { name: /search/i });
    const searchTerm: string = 'React';

    await user.type(input, searchTerm);
    expect(input.value).toBe('React'); // Schneller Check, ob Tippen funktioniert

    // Erwarte, dass fetchSuggestions nach dem Debounce aufgerufen wird
    // waitFor gibt dem 500ms Debounce + API-Mock-Zeit + Render-Zeit
    await waitFor(() => {
      expect(mockedFetchSuggestions).toHaveBeenCalled();
    }, { timeout: 1000 }); // Timeout für diesen waitFor, sollte > 500ms sein
    // Optional: Prüfe, ob es mit dem richtigen Begriff aufgerufen wurde
    // expect(mockedFetchSuggestions).toHaveBeenCalledWith(searchTerm);



    await user.click(button); // Löst fetchBooksThunk aus


    // Erwarte, dass fetchBooks aufgerufen wurde
    await waitFor(() => {

      expect(mockedFetchBooks).toHaveBeenCalledTimes(1);
      expect(mockedFetchBooks).toHaveBeenCalledWith(searchTerm);
    }, { timeout: 1000 }); // Timeout für diesen waitFor


    // Erwarte, dass die Ergebnisse (aus mockApiResponse für fetchBooks) im DOM erscheinen

    expect(await screen.findByText('React Testing For Beginners', {}, { timeout: 3000 })).toBeInTheDocument();
    expect(await screen.findByText('Advanced React Patterns', {}, { timeout: 3000 })).toBeInTheDocument();

  }); // Gesamttest-Timeout (vorher 15000, 10000 sollte reichen)
});
