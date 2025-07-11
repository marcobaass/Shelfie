import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import styles from './BookList.module.css';
import { Book } from '@/redux/books/bookTypes'

interface BookListProps {
  books: Book[]
}

export default function BookList({ books }: BookListProps) {
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
    // Could potentially check numFound === 0 here as well, if you want to distinguish
    // between "initial state" and "search returned zero results".
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
          <li key={book.id} className={styles.booklist}>
            <h3>{book.title}</h3>
            <p>
              Author(s): {book.author_name?.join(', ') || 'Unknown Author'}
              {book.year && ` (${book.year})`} {/* Optionally show year */}
            </p>
            {book.cover && (
                <img
                  style={{ maxHeight: '100px', float: 'left', marginRight: '10px' }}
                  src={`https://covers.openlibrary.org/b/id/${book.cover}-S.jpg`} // Small cover
                  alt={`${book.title} cover`}
                />
             )}
             {/* Maybe add a snippet of synopsis if available */}
             {book.synopsis && <p><i>{book.synopsis.substring(0, 150)}...</i></p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
