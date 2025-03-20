import React from 'react';
import SearchBar from '../SearchBar/SearchBar'
import { useDispatch } from 'react-redux'
import { fetchBooksThunk } from '../../redux/books/booksThunks';
import { AppDispatch } from '@/redux/store';

const SearchPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  const handleSearchDispatch = (query: string) => {
    dispatch(fetchBooksThunk(query));
  }

  return (
    <div>
      <h1>Search Books</h1>
      <SearchBar
        onSearch = {handleSearchDispatch}
      />
      /* Show the results */
    </div>
  );
};

export default SearchPage;
