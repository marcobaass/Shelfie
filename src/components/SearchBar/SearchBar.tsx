import React, { useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { fetchSuggestionsThunk } from '../../redux/books/booksThunks';
import { AppDispatch } from '../../redux/store';
import styles from './SearchBar.module.css';
import searchGif from "../../assets/search.gif";
import { setSelectedSuggestion, Book } from '../../redux/books/booksSlice'

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {


  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const suggestions = useSelector((state: RootState) => state.books.suggestions);
  const isSuggestionsLoading = useSelector((state: RootState) => state.books.suggestionsLoading);
  console.log(suggestions)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const dispatch = useDispatch<AppDispatch>();

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

  const handleUIRequest = () => {
    if(query.trim()) {
      onSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUIRequest();
    }
  };

  const handleSelectSuggestion = (suggestion: Book) => {
    console.log("Clicked Suggestion:", suggestion);
    dispatch(setSelectedSuggestion(suggestion));
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchField}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onFocus={() => setShowSuggestions(true)}
          placeholder='Search for books or authors'
          />
        {isSuggestionsLoading && (
          <div className={styles.searchGif}>
            <img src={searchGif} alt="" />
          </div>
        )}
      </div>
      <button onClick={handleUIRequest}>Search</button>

      <div className="suggestionBox">
        <ul className={styles.suggestions}>
        {showSuggestions && suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSelectSuggestion(suggestion)}>
              <p>Title: {suggestion.title}</p>
              <p>Author(s): {suggestion.author_name?.join(', ') || "Unknown"}</p>
            </li>
          ))
        ) : (
          <div></div>
        )}
        </ul>
      </div>
    </div>
  );
};

export default SearchBar
