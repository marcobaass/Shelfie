import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import store from '../../src/redux/store';
import SearchBar from '../components/SearchBar/SearchBar';

describe('SearchBar Component', () => {
  it('should call onSearch with the full query when the search button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnSearch = vi.fn();

    render (
      <Provider store={store} >
        <SearchBar onSearch={mockOnSearch} />
      </Provider>
    )

    const input = screen.getByPlaceholderText('Search for books or authors');
    const button = screen.getByText('Search');

    await user.type(input, 'React');
    await user.click(button)

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('React');
    });
  });

  it('should call onSearch with the full query when the Enter key is pressed', async () => {
    const user = userEvent.setup();
    const mockOnSearch = vi.fn();

    render(
      <Provider store={store}>
        <SearchBar onSearch={mockOnSearch} />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Search for books or authors');

    await user.type(input, 'React')
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('React');
    });
  });

  it('should update the Redux store with the selected suggestion when a suggestion is clicked', async () => {
    const user = userEvent.setup();
    const mockOnSearch = vi.fn();

    store.dispatch({
      type: 'suggestions/fetchSuggestions/fulfilled',
      payload: {
        docs: [
          { id: '1', title: 'Book 1', author_name: ['Author 1'] },
          { id: '2', title: 'Book 2', author_name: ['Author 2'] }
        ],
      },
    });

    render(
      <Provider store={store}>
        <SearchBar onSearch={mockOnSearch} />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Search for books or authors');

    await user.type(input, 'Book');

    const suggestionItem = await screen.findByText(/Book 1/i);
    expect(suggestionItem).toBeInTheDocument();

    await user.click(suggestionItem);

    await waitFor(() => {
      const state = store.getState();
      expect(state.suggestions.selectedSuggestion).toEqual({
        id: '1',
        title: 'Book 1',
        author_name: ['Author 1']
      });
    });
  });
});
