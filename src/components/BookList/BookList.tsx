import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import styles from './BookList.module.css';
import { Book } from '@/redux/books/bookTypes'

interface BookListProps {
  books: Book[],
  onBookClick: (book: Book) => void;
}

export default function BookList({ books, onBookClick }: BookListProps ) {
  const isLoading = useSelector((state: RootState) => state.search.booksLoading);
  const error = useSelector((state: RootState) => state.search.error);
  const numFound = useSelector((state: RootState) => state.search.numFound);

  if (isLoading) {
    return <p>Loading search results...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!books || books.length === 0) {
    return <p>No books found matching your query.</p>;
  }

  console.log('Books found: ', books)

  // 4. Display Results (if not loading, no error, and books exist)
  return (
    <div>
      {numFound > 0 && <p>Found {numFound} results:</p>}

      <ul>
        {books.map((book) => (
          // Use the unique book ID as the key
          <li
            key={book.id}
            className={styles.booklist}
            onClick={() => onBookClick(book)}
          >
            {book.cover && (
                <img
                  className={styles.covers}
                  // style={{ maxHeight: '100px', float: 'left', marginRight: '10px' }}
                  src={`https://covers.openlibrary.org/b/id/${book.cover}-M.jpg`}
                  alt={`${book.title} cover`}
                />
             )}
            <h3>{book.title}</h3>
            <p>
              Author(s): {book.author_name?.join(', ') || 'Unknown Author'}
              <hr></hr>
              {book.year && `${book.year}`} {/* Optionally show year */}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
