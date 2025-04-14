import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import store from '../../src/redux/store';
import SearchBar from '../components/SearchBar/SearchBar';

describe('SearchBar Component', () => {
  it('should call onSearch with the full query when the search button is clicked', async () => {
    const mockOnSearch = vi.fn();

    render (
      <Provider store={store} >
        <SearchBar onSearch={mockOnSearch} />
      </Provider>
    )

    const input = screen.getByPlaceholderText('Search for books or authors');
    const button = screen.getByText('Search');

    fireEvent.change(input, {target: {value: 'React' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('React');
    });
  });

  it('should call onSearch with the full query when the Enter key is pressed', async () => {
    const mockOnSearch = vi.fn();

    render(
      <Provider store={store}>
        <SearchBar onSearch={mockOnSearch} />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Search for books or authors');

    fireEvent.change(input, { target: { value: 'React' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('React');
    });
  });

  it('should update the Redux store with the selected suggestion when a suggestion is clicked', async () => {
    store.dispatch({
      type: 'books/fetchSuggestions/fulfilled',
      payload: {
        docs: [
          { id: '1', title: 'Book 1', author_name: ['Author 1'] },
          { id: '2', title: 'Book 2', author_name: ['Author 2'] }
        ],
      },
    });

    render(
      <Provider store={store}>
        <SearchBar onSearch={() => {}} />
      </Provider>
    );

    // Wait for the suggestions to appear on screen
    await waitFor(() => {
      expect(screen.getByText(/Book 1/i)).toBeInTheDocument();
    });

    // Click the first suggestion ("Book 1")
    const suggestionItem = screen.getByText(/Book 1/i);
    fireEvent.click(suggestionItem);

    // Check that the Redux store is updated
    const state = store.getState();
    expect(state.books.selectedSuggestion).toEqual({
      id: '1',
      title: 'Book 1',
      author_name: ['Author 1']
      // any additional fields (cover, year, synopsis) if available
    });
  });
});
