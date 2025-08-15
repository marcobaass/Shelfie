import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store'
import { Book, RawApiDoc, RawEditionApiDoc } from '@/redux/books/bookTypes';
import styles from './BookDetailsPage.module.css';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchEditionsThunk } from "../../redux/books/booksThunks";

export default function BookDetailsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  console.log('bookId: ', id);


  const selectedSuggestion = useSelector((state: RootState): Book | null => state.suggestions.selectedSuggestion)
  const detailedBook = useSelector((state: RootState): RawApiDoc | null => state.suggestions.detailedBook);
  const detailsLoading = useSelector((state: RootState): boolean => state.suggestions.detailsLoading);
  const detailedEditions = useSelector((state: RootState): RawEditionApiDoc[] | null => state.suggestions.detailedEditions);



  const displayBook = detailedBook || selectedSuggestion

  useEffect(() => {
    if(id) {
      dispatch(fetchEditionsThunk(id))
    }
  }, [])

  console.log('detailed Book: ', detailedBook);
  console.log('Selected Suggestions: ', selectedSuggestion)
  console.log('Editions: ', detailedEditions);
  console.log('Display Book: ', displayBook);


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
            <h2 className={styles.author}>{selectedSuggestion?.author_name?.join(', ') || 'unknown'}</h2>
            <p>{ detailedBook?.description ? (typeof detailedBook.description === 'string' ? detailedBook.description : detailedBook.description.value) : 'unknown' }</p>
            <p>Pages: { detailedEditions?.[0]?.number_of_pages || 'unknown' }</p>
            <p>Published: { selectedSuggestion?.year || 'unknown' }</p>
            {/* ISBN is an array of strings, so we display the first one if available. */}
            <p>ISBN13: { detailedEditions?.[0]?.isbn_13?.[0] || 'unknown' }</p>
            <p>Language: {
              detailedEditions?.[1]?.languages?.[0]?.key
                ? detailedEditions[1].languages[0].key.replace('/languages/', '')
                : 'unknown'
            }</p>
          </div>
        </div>
      ) : (
        <p>No book selected. Please use the search bar to find a book.</p>
      )}
    </div>
  )
}
