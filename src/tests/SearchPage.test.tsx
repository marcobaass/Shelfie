import React from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import booksReducer from '../redux/books/booksSlice';
import { describe, it, expect, vi } from 'vitest';
import SearchPage from '../components/SearchPage/SearchPage';

describe('SearchPage Component', () => {
  it('should dispatch fetchBooksThunk when search is triggered', async () => {

    const store = configureStore({
      reducer: {
        books: booksReducer,
      },
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <SearchPage />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Search for books or authors');
    const button = screen.getByText('Search');

    fireEvent.change(input, { target: { value:'React' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalled();

      expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Function));
    });
  });
});
