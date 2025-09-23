import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store'
import { Book, RawApiDoc, RawEditionApiDoc } from '@/redux/books/bookTypes';
import styles from './BookDetailsPage.module.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchBookDetailsThunk, fetchEditionsThunk } from "../../redux/books/booksThunks";

import HeartIcon from '../../assets/icons/heartIcon.svg?react';
import BookIcon from '../../assets/icons/bookIcon.svg?react';
import FinishIcon from '../../assets/icons/finishIcon.svg?react';

export default function BookDetailsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  console.log('bookId: ', id);


  const selectedSuggestion = useSelector((state: RootState): Book | null => state.suggestions.selectedSuggestion)
  const detailedBook = useSelector((state: RootState): RawApiDoc | null => state.suggestions.detailedBook);
  const detailsLoading = useSelector((state: RootState): boolean => state.suggestions.detailsLoading);
  const detailedEditions = useSelector((state: RootState): RawEditionApiDoc[] | null => state.suggestions.detailedEditions);

  const [isCoverLoaded, setIsCoverLoaded] = useState(false);

  const [isOnWishlist, setIsOnWishlist] = useState(false);
  const [isOnReading, setIsOnReading] = useState(false);
  const [isOnFinished, setIsOnFinished] = useState(false);

  const displayBook = detailedBook || selectedSuggestion;

  useEffect(() => {
    setIsCoverLoaded(false);

    if(id) {
      dispatch(fetchBookDetailsThunk(id));
      dispatch(fetchEditionsThunk(id));
    }
  }, [dispatch, id])

  console.log('detailed Book: ', detailedBook);
  console.log('Selected Suggestions: ', selectedSuggestion)
  console.log('Editions: ', detailedEditions);
  console.log('Display Book: ', displayBook);


  const imgLink = selectedSuggestion?.cover
                  ? `https://covers.openlibrary.org/b/id/${selectedSuggestion.cover}-M.jpg`
                  : null;

  const placeholderImg = "../../src/assets/images/book-stack.png"

  if (detailsLoading) {
    return <p>Loading book details...</p>;
  }

  function handleStatusChange(status: string) {
    switch (status) {
      case 'wishlist':
        setIsOnWishlist(!isOnWishlist);
        setIsOnReading(false);
        setIsOnFinished(false);
        break;

      case 'reading':
        setIsOnWishlist(false);
        setIsOnReading(!isOnReading);
        setIsOnFinished(false);
        break;

      case 'finished':
        setIsOnWishlist(false);
        setIsOnReading(false);
        setIsOnFinished(!isOnFinished);
        break;

      default:
        break;
    }
  }

  return (
    <div>
      {displayBook ? (
        <div className={styles.wrapper}>
          <div className={styles.imageContainer}>
            {!isCoverLoaded && (
              <img
                src={placeholderImg}
                alt="placeholder-image"
                className={styles.placeholder}
              />
            )}
            {imgLink && (
              <img
                key={selectedSuggestion?.cover}
                src={imgLink}
                alt={`${displayBook.title} cover`}
                onLoad = {() => setIsCoverLoaded(true)}
                onError={() => setIsCoverLoaded(false)}
                style = {{ display: isCoverLoaded ? 'block' : 'none' }}
              />
            )}

          </div>

          <div className={styles.bookDetails}>
            <div className={styles.titleWrapper}>
              <h1 className={styles.title}>{displayBook.title}</h1>
              <HeartIcon className={!isOnWishlist ? styles.navIconTrans : styles.navIconFill} onClick={() => handleStatusChange('wishlist')}/>
              <BookIcon className={!isOnReading ? styles.navIconTrans : styles.navIconFill} onClick={() => handleStatusChange('reading')} />
              <FinishIcon className={!isOnFinished ? styles.navIconTrans : styles.navIconFill} onClick={() => handleStatusChange('finished')} />
            </div>
            <h2 className={styles.author}>{selectedSuggestion?.author_name?.join(', ') || 'Author unknown'}</h2>
            <p>{ detailedBook?.description ? (typeof detailedBook.description === 'string' ? detailedBook.description : detailedBook.description.value) : 'No synopsis yet' }</p>
            <p><span  className={styles.info}>Pages: </span>{ detailedEditions?.[0]?.number_of_pages || 'unknown' }</p>
            <p><span  className={styles.info}>Published: </span>{ selectedSuggestion?.year || 'unknown' }</p>
            {/* ISBN is an array of strings, so we display the first one if available. */}
            <p><span  className={styles.info}>ISBN13: </span>{ detailedEditions?.[0]?.isbn_13?.[0] || 'unknown' }</p>
            <p><span  className={styles.info}>Language: </span>{
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
