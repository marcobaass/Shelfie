import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import styles from './BookList.module.css';
import { Book } from '@/redux/books/bookTypes';
import placeholderImg from '../../assets/images/book-stack.png';
import { useState } from 'react';

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
    return <p>Loading search results...</p>;
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
      {numFound > 0 && <p style={{marginTop: '1rem'}}>Found {numFound} results:</p>}

      <ul>
        {books.map((book) => (
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
            <h3 className={styles.truncatedText}>{book.title}</h3>
            <p className={styles.authorAndYear}>
              Author(s): {authorsFormat(book.author_name ?? [])}
              {/* Author(s): {book.author_name?.join(', ') || 'Unknown Author'} */}
              <hr></hr>
              {book.year && `${book.year}`} {/* Optionally show year */}
            </p>
          </li>
        ))}
      </ul>
      {/* pagination controls */}
      {showPagination && setPage &&(
        <div className={styles.pagination}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className={styles.paginationButton}
          >
            <p>Previous</p>
          </button>
          <span style={{margin: '3rem'}}>Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!totalPages || page >= totalPages}
            className={styles.paginationButton}
          >
            <p>Next</p>
          </button>
        </div>
      )}
    </div>
  );
}
