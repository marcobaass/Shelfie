import React from 'react';
import SearchBar from '../SearchBar/SearchBar'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBooksThunk } from '../../redux/books/booksThunks';
import { AppDispatch, RootState } from '@/redux/store';
import BookList from '../BookList/BookList';
import { useNavigate } from 'react-router-dom';
import { useSearchParams  } from 'react-router-dom';
import { useEffect } from 'react';

const SearchListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q')

  const booksToDisplay = useSelector((state: RootState) => state.search.books)

  const handleSearchSubmit = (query: string) => {
    dispatch(fetchBooksThunk(query));
    navigate(`/search?q=${encodeURIComponent(query)}`, { replace: true });
  };

  useEffect(() => {
    dispatch(fetchBooksThunk(query))
  }, [dispatch, query])

  const handleSelectSuggestionAndNavigate = (book: Book) => {
    navigate(`/book/${book.key}`);
  };

  return (
    <div>
      <h1>Search Books</h1>
      <SearchBar
        onSearchSubmit={handleSearchSubmit}
        onSelectSuggestion={handleSelectSuggestionAndNavigate}
        initialShowSuggestions={false}
      />

      <BookList books={booksToDisplay} />
    </div>
  );
};

export default SearchListPage;
