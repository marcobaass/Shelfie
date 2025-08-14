import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store'
import { Book, RawApiDoc } from '@/redux/books/bookTypes';
import styles from './BookDetailsPage.module.css';

export default function BookDetailsPage() {
  const selectedSuggestion = useSelector((state: RootState): Book | null => state.suggestions.selectedSuggestion)
  const detailedBook = useSelector((state: RootState): RawApiDoc | null => state.suggestions.detailedBook)
  const detailsLoading = useSelector((state: RootState): boolean => state.suggestions.detailsLoading)

  console.log('Bookdetails: ', detailedBook);


  const displayBook = detailedBook || selectedSuggestion

  const imgLink = selectedSuggestion?.cover
                  ? `https://covers.openlibrary.org/b/id/${selectedSuggestion.cover}-M.jpg`
                  : null;

  if (detailsLoading) {
    return <p>Loading book details...</p>;
  }

  return (
    <div>
      {displayBook ? (
        <div className={styles.wrapper}>
          <div className={styles.imageContainer}>
            {imgLink && (
              <img
                key={selectedSuggestion?.cover}
                src={imgLink}
                alt={`${displayBook.title} cover`}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            
          </div>

          <div className={styles.bookDetails}>
            <h1 className={styles.title}>{displayBook.title}</h1>
            <h2 className={styles.author}>{displayBook.author_name?.join(', ') || 'unknown'}</h2>
            <p>{ detailedBook?.description ? (typeof detailedBook.description === 'string' ? detailedBook.description : detailedBook.description.value) : 'unknown' }</p>
            <p>Pages: { detailedBook?.number_of_pages || 'unknown' }</p>
            <p>Published: { detailedBook?.first_publish_year || 'unknown' }</p>
            {/* ISBN is an array of strings, so we display the first one if available. */}
            <p>ISBN: { detailedBook?.isbn?.[0] || 'unknown' }</p>
            <p>Language: { detailedBook?.language?.[0] || 'unknown' }</p>
          </div>
        </div>
      ) : (
        <p>No book selected. Please use the search bar to find a book.</p>
      )}
    </div>
  )
}
