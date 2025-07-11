import React, { useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { fetchSuggestionsThunk } from '../../redux/books/booksThunks';
import { AppDispatch } from '../../redux/store';
import styles from './SearchBar.module.css';
import searchGif from "../../assets/search.gif";
import { setSelectedSuggestion, setShowSuggestions, clearSuggestions } from '../../redux/books/suggestionsSlice';
import { Book } from '@/redux/books/bookTypes';

interface SearchBarProps {
  onSearchSubmit: (query: string) => void;
  onSelectSuggestion: (book: Book) => void;
  initialShowSuggestions?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchSubmit, onSelectSuggestion }) => {

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const suggestions = useSelector((state: RootState) => state.suggestions.suggestions);
  const isSuggestionsLoading = useSelector((state: RootState) => state.suggestions.suggestionsLoading);
  const dispatch = useDispatch<AppDispatch>();
  const showSuggestions = useSelector((state: RootState) => state.suggestions.showSuggestions)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // debounce delay of 500ms

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      dispatch(fetchSuggestionsThunk(debouncedQuery)); // dispatch thunk with debounced query
    }
  }, [debouncedQuery, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
  };

  const handleFinalSearch = () => {
    if (query.trim()) {
      dispatch(setShowSuggestions(false));
      dispatch(clearSuggestions());
      onSearchSubmit(query);
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFinalSearch();
    }
  };

  const handleSuggestionClick = (suggestion: Book) => {
    dispatch(setShowSuggestions(false))
    dispatch(clearSuggestions());
    dispatch(setSelectedSuggestion(suggestion));
    onSelectSuggestion(suggestion);
    setQuery(suggestion.title || '');
  };

  return (
    <div className={styles.searchContainer}>

      <div className={styles.searchBar}>
        <div className={styles.searchField}>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => dispatch(setShowSuggestions(false)), 150)}
            onFocus={() => dispatch(setShowSuggestions(true))}
            placeholder='Search for books or authors'
            />
          {isSuggestionsLoading && (
            <div className={styles.searchGif}>
              <img src={searchGif} alt="" />
            </div>
          )}
        </div>

        <button onClick={handleFinalSearch}>Search</button>
      </div>

      <div className={styles.suggestionBox}>
        <ul className={styles.suggestions}>
        {showSuggestions && suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <li key={index} onMouseDown={() => handleSuggestionClick(suggestion)}>
              <p>{suggestion.title}</p>
              📖
              <p> {suggestion.author_name?.join(', ') || "Unknown"}</p>
            </li>
          ))
        ) : (
          null
        )}
        </ul>
      </div>
    </div>
  );
};

export default SearchBar
