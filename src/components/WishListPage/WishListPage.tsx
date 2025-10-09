import { useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { fetchBookDetailsThunk } from '../../redux/books/booksThunks';
import { setSelectedSuggestion } from '../../redux/books/suggestionsSlice';
import BookList from '../BookList/BookList';
import { Book } from '../../redux/books/bookTypes'

export default function WishListPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [wishlist] = useLocalStorage<Book[]>('wishlist', []);
  const [page, setPage] = useState(1);

  const booksPerPage = 10;
  const totalPages = Math.ceil(wishlist.length / booksPerPage);
  const startIndex = (page - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const paginatedBooks = wishlist.slice(startIndex, endIndex)

  const handleBookClick = (book: Book) => {
    dispatch(setSelectedSuggestion(book));
    dispatch(fetchBookDetailsThunk(book.id));
    navigate(`/book/${book.id}`);
  };

  return (
    <div>
      <h1>My Wishlist</h1>
      <BookList
        // books={wishlist}
        books={paginatedBooks}
        onBookClick={handleBookClick}
        isLoading={false}
        numFound={wishlist.length}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </div>
  )
}
