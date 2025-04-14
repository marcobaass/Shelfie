import React from "react";
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import booksReducer from '../redux/books/booksSlice';
// Import the module containing the thunk
import * as booksThunks from '../redux/books/booksThunks';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Mock Setup ---
// Mock the entire module. Vitest replaces exports with vi.fn() automatically.
vi.mock('../redux/books/booksThunks');
// --- End Mock Setup ---

// Import the component AFTER the mock is defined.
import SearchPage from '../components/SearchPage/SearchPage';

describe('SearchPage Component', () => {

  beforeEach(() => {
    // Reset all mocks (including the auto-mocks created by vi.mock)
    vi.clearAllMocks();
  });

  it('should call fetchBooksThunk action creator with the correct query when search is triggered', async () => {
    // Arrange
    const user = userEvent.setup();
    const store = configureStore({
      reducer: {
        books: booksReducer,
      },
    });

    // **Get a typed reference to the auto-mocked function**
    const mockedFetchBooksThunk = vi.mocked(booksThunks.fetchBooksThunk);

    mockedFetchBooksThunk.mockReturnValue(
      // Properly type the thunk return value
      (() => Promise.resolve()) as unknown as ReturnType<typeof booksThunks.fetchBooksThunk>
    );

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
    // Assertions remain the same, targeting the mocked function reference
    expect(mockedFetchBooksThunk).toHaveBeenCalledTimes(1);
    expect(mockedFetchBooksThunk).toHaveBeenCalledWith(searchTerm);
  });
});




//
