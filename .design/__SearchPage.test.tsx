import React from "react";
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import booksReducer from '../src/redux/books/searchSlice';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchPage from '../src/components/BookList/BookList';
import Book from '../src/redux/books/searchSlice';

// Important: Import these after vi.mock calls
// These imports will be auto-mocked
import * as booksThunks from '../src/redux/books/booksThunks';
import { fetchBooks, fetchSuggestions } from '../src/API/api';

// Mock setup (hoisted to top of file)
vi.mock('../redux/books/booksThunks');
vi.mock('../API/api');

const mockBookData: Book[] = [
  { id: '1', title: 'React Testing For Beginners', author_name: ['John Doe'] },
  { id: '2', title: 'Advanced React Patterns', author_name: ['Jane Smith'] },
];
const mockApiResponse = { docs: mockBookData, numFound: 2 };

describe('SearchPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when dispatching actions', () => {
    it('should call fetchBooksThunk action creator with the correct query when search is triggered', async () => {
      // Configure the mock for this specific test
      const mockedFetchBooksThunk = vi.mocked(booksThunks.fetchBooksThunk);
      mockedFetchBooksThunk.mockReturnValue(
        (() => Promise.resolve()) as unknown as ReturnType<typeof booksThunks.fetchBooksThunk>
      );

      // Arrange
      const user = userEvent.setup();
      const store = configureStore({
        reducer: {
          books: booksReducer,
        },
      });

      // Now render the component, which will use the configured mock
      render(
        <Provider store={store}>
          <SearchPage />
        </Provider>
      );

      const input = screen.getByPlaceholderText('Search for books or authors');
      const button = screen.getByRole('button', { name: /search/i });
      const searchTerm = 'React';

      // Act
      await user.type(input, searchTerm);
      await user.click(button);

      // Assert
      expect(mockedFetchBooksThunk).toHaveBeenCalledTimes(1);
      expect(mockedFetchBooksThunk).toHaveBeenCalledWith(searchTerm);
    });
  });

  describe('should display book results', () => {
    beforeEach(() => {
      // For the second test, configure API mocks but let the thunk use them
      vi.mocked(fetchBooks).mockResolvedValue(mockApiResponse);
      vi.mocked(fetchSuggestions).mockResolvedValue({ docs: [], numFound: 0 });

      // Reset the thunk mock to use the real implementation
      vi.mocked(booksThunks.fetchBooksThunk).mockImplementation(
        // Use the original implementation that will call our mocked API
        (query) => {
          return async (dispatch) => {
            dispatch({ type: 'books/fetchBooks/pending' });
            try {
              const response = await fetchBooks(query);
              dispatch({
                type: 'books/fetchBooks/fulfilled',
                payload: response
              });
              return response;
            } catch (error) {
              dispatch({
                type: 'books/fetchBooks/rejected',
                error: error
              });
              throw error;
            }
          };
        }
      );
    });

    it('should display book results after a successful search', async () => {
      const user = userEvent.setup();

      const store = configureStore({
        reducer: {
          books: booksReducer
        }
      });

      render(
        <Provider store={store}>
          <SearchPage />
        </Provider>
      );

      const input = screen.getByPlaceholderText(/search/i);
      const button = screen.getByRole('button', { name: /search/i });
      const searchTerm = 'React';

      await user.type(input, searchTerm);
      await user.click(button);

      expect(fetchBooks).toHaveBeenCalledTimes(1);
      expect(fetchBooks).toHaveBeenCalledWith(searchTerm);
      expect(await screen.findByText('React Testing For Beginners')).toBeInTheDocument();
      expect(await screen.findByText('Advanced React Patterns')).toBeInTheDocument();
    });
  });
});
