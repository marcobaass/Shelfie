import { useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { fetchBookDetailsThunk } from '../../redux/books/booksThunks';
import { setSelectedSuggestion } from '../../redux/books/suggestionsSlice';
import BookList from '../BookList/BookList';
import { Book } from '../../redux/books/bookTypes'

export default function ReadingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [reading] = useLocalStorage<Book[]>('reading', []);
  const [page, setPage] = useState(1);

  const booksPerPage = 10;
  const totalPages = Math.ceil(reading.length / booksPerPage);
  const startIndex = (page - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const paginatedBooks = reading.slice(startIndex, endIndex)

  const handleBookClick = (book: Book) => {
    dispatch(setSelectedSuggestion(book));
    dispatch(fetchBookDetailsThunk(book.id));
    navigate(`/book/${book.id}`);
  };

  return (
    <div>
      <h1>I am reading</h1>
      <BookList
        books={paginatedBooks}
        onBookClick={handleBookClick}
        isLoading={false}
        numFound={reading.length}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </div>
  )
}
