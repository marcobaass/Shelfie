import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import styles from './BookList.module.css';
import { Book } from '@/redux/books/bookTypes';
import placeholderImg from '../../assets/images/book-stack.png';
import { useState } from 'react';
import { updateBookStatus, StatusType } from '../../utils/bookStatusUtils';
import HeartIcon from '../../assets/icons/heartIcon.svg?react';
import BookIcon from '../../assets/icons/bookIcon.svg?react';
import FinishIcon from '../../assets/icons/finishIcon.svg?react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import searchGif from "../../assets/search.gif";


interface BookListProps {
  books: Book[],
  onBookClick: (book: Book) => void;
  page?: number;
  setPage?: (page: number) => void;
  totalPages?: number;
  numFound?: number;
  isLoading?: boolean;
  error?: string | null;
}

export default function BookList({
  books,
  onBookClick,
  page=1,
  setPage,
  totalPages,
  numFound=0,
  isLoading: externalIsLoading,
  error: externalError
 }: BookListProps ) {

  const [wishlist, setWishlist] = useLocalStorage<Book[]>('wishlist', []);
  const [reading, setReading] = useLocalStorage<Book[]>('reading', []);
  const [finished, setFinished] = useLocalStorage<Book[]>('finished', []);

  function handleStatusChange(book: Book, status: StatusType) {
    console.log(book.id, book);

    if(!book.id || !book) return;

    const updatedLists = updateBookStatus(book, status, wishlist, reading, finished);
    setWishlist(updatedLists.wishlist);
    setReading(updatedLists.reading);
    setFinished(updatedLists.finished);
  }

  const reduxIsLoading = useSelector((state: RootState) => state.search.booksLoading);
  const reduxError = useSelector((state: RootState) => state.search.error);

  const isLoading = externalIsLoading !== undefined ? externalIsLoading : reduxIsLoading;
  const error = externalError !== undefined ? externalError : reduxError;

  const [loadedCovers, setLoadedCovers] = useState<Record<string, boolean>>({});

  const showPagination = numFound > 10 && totalPages && totalPages > 1 && setPage;

  const handleCoverLoad = (bookId: string) => {
    setLoadedCovers(prev => ({...prev, [bookId]: true}));
  };

  const handleCoverError = (bookId: string) => {
    setLoadedCovers(prev => ({...prev, [bookId]: false}))
  }

  if (isLoading) {
    return(
      <div className={styles.searchGif}>
        <img src={searchGif} alt="" aria-hidden="true" />
      </div>
    )
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!books || books.length === 0) {
    return <p>No books found.</p>;
  }

  const authorsFormat = (authors: string[]) => {
    if (authors) {
      if (authors.length === 0) {
      return 'unknown author'
      } else if(authors.length < 4) {
        return authors?.join(', ')
      } else {
        const visibleAuthors: string[] = authors.slice(0,3)
        visibleAuthors.push('et al')
        return visibleAuthors.join(', ')
    }}
  }

  return (
    <div>

      <ul className={styles.bookList}>
        {numFound > 0 && <p className={styles.numFoundBooks}>Found {numFound} results:</p>}
        {books.map((book) => {
          const isOnWishlist = wishlist.some(b => b.id === book.id);
          const isOnReading = reading.some(b => b.id === book.id);
          const isOnFinished = finished.some(b => b.id === book.id);

          return (
            <li
              key={book.id}
              className={styles.booklist}
              onClick={() => onBookClick(book)}
            >
              <img
                src={placeholderImg}
                alt="placeholder-image"
                className={styles.covers}
                style={{ display: loadedCovers[book.id] ? 'none' : 'block' }}
              />
              {book.cover && (
                <img
                  key={book.id}
                  className={styles.covers}
                  src={`https://covers.openlibrary.org/b/id/${book.cover}-M.jpg`}
                  alt={`${book.title} cover`}
                  onLoad={() => handleCoverLoad(book.id)}
                  onError={() => handleCoverError(book.id)}
                />
               )}
              <div className={styles.tileAndAuthor}>
                <h3 className={styles.truncatedText}>{book.title}</h3>
                  <p>
                    Author(s): {authorsFormat(book.author_name ?? [])}
                    {/* Author(s): {book.author_name?.join(', ') || 'Unknown Author'} */}
                  </p>
              </div>

              <p className={styles.iconsAndYear}>
                <HeartIcon
                  className={!isOnWishlist ? styles.navIconTrans : styles.navIconFill}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(book, 'wishlist');
                  }}
                />
                <BookIcon
                  className={!isOnReading ? styles.navIconTrans : styles.navIconFill}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(book, 'reading');
                  }}
                />
                <FinishIcon
                  className={!isOnFinished ? styles.navIconTrans : styles.navIconFill}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(book, 'finished');
                  }}
                />
                <hr></hr>
                <p className={styles.bookYear}>{book.year && `${book.year}`}</p>
              </p>
            </li>
          );
        })}
        </ul>
        {/* pagination controls */}
        {showPagination && setPage &&(
          <div className={styles.pagination}>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className={styles.paginationButton}
            >
              <p className={styles.prevText} aria-label="Previous page"></p>
            </button>
            <span style={{margin: '3rem'}}>Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!totalPages || page >= totalPages}
              className={styles.paginationButton}
            >
              <p className={styles.nextText} aria-label="Next page"></p>
            </button>
          </div>
        )}
      </div>
    )
}
