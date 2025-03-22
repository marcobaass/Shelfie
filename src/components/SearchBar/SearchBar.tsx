import React, { useState} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { fetchSuggestionsThunk } from '../../redux/books/booksThunks';
import { AppDispatch } from '../../redux/store';
import styles from './SearchBar.module.css';
import searchGif from "../../assets/search.gif";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {


  const [query, setQuery] = useState('');
  const suggestions = useSelector((state: RootState) => state.books.suggestions);
  const isSuggestionsLoading = useSelector((state: RootState) => state.books.suggestionsLoading);
  console.log(suggestions)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const dispatch = useDispatch<AppDispatch>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    dispatch(fetchSuggestionsThunk(newQuery));
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
            <li key={index}>
              <p>Title: {suggestion.title}</p>
              <p>Author(s): {suggestion.authors}</p>
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
