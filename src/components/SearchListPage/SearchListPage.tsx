import React, { useEffect, useState } from 'react';
import SearchBar from '../SearchBar/SearchBar'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBooksThunk, fetchBookDetailsThunk } from '../../redux/books/booksThunks';
import { AppDispatch, RootState } from '@/redux/store';
import BookList from '../BookList/BookList';
import { useNavigate } from 'react-router-dom';
import { useSearchParams  } from 'react-router-dom';
import { setSelectedSuggestion } from '../../redux/books/suggestionsSlice'
import { Book } from '@/redux/books/bookTypes'

const SearchListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q')

  const numFound = useSelector((state: RootState) => state.search.numFound);

  const booksToDisplay = useSelector((state: RootState) => state.search.books)

  const booksPerPage = 100; // or whatever your API uses
  const totalPages = Math.ceil(numFound / booksPerPage);

  const handleSearchSubmit = (query: string) => {
    const newParams = new URLSearchParams();
    newParams.set('q', query);
    newParams.set('page', '1');
    setSearchParams(newParams, { replace: true });
  };


  const handleSelectSuggestionAndNavigate = (book: Book) => {
    // 1. Dispatch the action to set the selected book in the Redux store.
    dispatch(setSelectedSuggestion(book));
    // 2. Dispatch the thunk to fetch the detailed information for that book, using its unique key as the ID.
    dispatch(fetchBookDetailsThunk(book.id));
    // 3. Navigate to the book details page.
    navigate(`/book/${book.id}`);
  };

  const [page, setPage] = useState(1);

  useEffect(() => {
    if (query) {
      dispatch(fetchBooksThunk({query, page}));
    }
  }, [dispatch, query, page]);

  return (
    <div>
      <h1>Search Books</h1>
      <SearchBar
        onSearchSubmit={handleSearchSubmit}
        onSelectSuggestion={handleSelectSuggestionAndNavigate}
        initialShowSuggestions={false}
      />

      <BookList books={booksToDisplay}
        onBookClick={handleSelectSuggestionAndNavigate}
        page={page}
        setPage={setPage}
        numFound={numFound}
        totalPages={totalPages}
      />
    </div>
  );
};

export default SearchListPage;
