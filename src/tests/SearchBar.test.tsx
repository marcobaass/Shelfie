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
});
