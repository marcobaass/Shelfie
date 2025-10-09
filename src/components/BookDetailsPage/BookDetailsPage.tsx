import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store'
import { Book, RawApiDoc, RawEditionApiDoc } from '@/redux/books/bookTypes';
import styles from './BookDetailsPage.module.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchBookDetailsThunk, fetchEditionsThunk } from "../../redux/books/booksThunks";
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { splitSubjects } from '../../utils/subjectsList';

import HeartIcon from '../../assets/icons/heartIcon.svg?react';
import BookIcon from '../../assets/icons/bookIcon.svg?react';
import FinishIcon from '../../assets/icons/finishIcon.svg?react';

import placeholderImg from '../../assets/images/book-stack.png';

export default function BookDetailsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  const selectedSuggestion = useSelector((state: RootState): Book | null => state.suggestions.selectedSuggestion)
  const detailedBook = useSelector((state: RootState): RawApiDoc | null => state.suggestions.detailedBook);
  const detailsLoading = useSelector((state: RootState): boolean => state.suggestions.detailsLoading);
  const detailedEditions = useSelector((state: RootState): RawEditionApiDoc[] | null => state.suggestions.detailedEditions);

  const [isCoverLoaded, setIsCoverLoaded] = useState(false);

  const [wishlist, setWishlist] = useLocalStorage<Book[]>('wishlist', []);
  const [reading, setReading] = useLocalStorage<Book[]>('reading', []);
  const [finished, setFinished] = useLocalStorage<Book[]>('finished', []);

  const isOnWishlist = id ? wishlist.some(book => book.id === id) : false;
  const isOnReading = id ? reading.some(book => book.id === id) : false;
  const isOnFinished = id ? finished.some(book => book.id === id) : false;

  const displayBook = detailedBook || selectedSuggestion;

  type Description = string | { value: string } | undefined | null;

  const getDescription = (description: Description): string => {
    if (!description) return 'No synopsis yet';
    if (typeof description === 'string') return description;
    if (typeof description === 'object' && 'value' in description) {
      return description.value;
    }
    return 'No synopsis yet';
  };

  useEffect(() => {
    setIsCoverLoaded(false);

    if(id) {
      dispatch(fetchBookDetailsThunk(id)).catch(error => {
        console.error('Failed to fetch book details:', error);
      });
      dispatch(fetchEditionsThunk(id)).catch(error => {
        console.error('Failed to fetch editions:', error);
      });
    }
  }, [dispatch, id])

  const imgLink = selectedSuggestion?.cover
                  ? `https://covers.openlibrary.org/b/id/${selectedSuggestion.cover}-M.jpg`
                  : null;

  if (detailsLoading) {
    return <p>Loading book details...</p>;
  }

  function handleStatusChange(status: 'wishlist' | 'reading' | 'finished') {
    if(!id || !displayBook) return;

    const bookToStore: Book = {
      id,
      title: displayBook.title || 'Unknown Title',
      author_name: displayBook.author_name || selectedSuggestion?.author_name || [],
      cover: displayBook.cover || selectedSuggestion?.cover,
      year: displayBook.year || selectedSuggestion?.year
    };

    switch (status) {
      case 'wishlist':
        if (isOnWishlist) {
        setWishlist(wishlist.filter(book => book.id !== id));
      } else {
        setWishlist([...wishlist, bookToStore]);
        setReading(reading.filter(book => book.id !== id));
        setFinished(finished.filter(book => book.id !== id));
      }
      break;

      case 'reading':
        if (isOnReading) {
          setReading(reading.filter(book => book.id !== id));
        } else {
          setWishlist(wishlist.filter(book => book.id !== id));
          setReading([...reading, bookToStore]);
          setFinished(finished.filter(book => book.id !== id));
        }
        break;

      case 'finished':
        if (isOnFinished) {
          setFinished(finished.filter(book => book.id !== id));
        } else {
          setWishlist(wishlist.filter(book => book.id !== id));
          setReading(reading.filter(book => book.id !== id));
          setFinished([...finished, bookToStore]);
        }
        break;

      default:
        break;
    }
  }

  const filteredSubjects = splitSubjects(detailedBook?.subjects || [], 8)


  return (
    <div>
      {displayBook ? (
        <div className={styles.wrapper}>
          <div className={styles.imageContainer}>
            {/* Cover */}
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

          {/* Book Infos */}
          <div className={styles.bookDetails}>
            <div className={styles.titleWrapper}>
              <h1 className={styles.title}>{displayBook.title}</h1>
              <HeartIcon
                className={!isOnWishlist ? styles.navIconTrans : styles.navIconFill}
                onClick={() => handleStatusChange('wishlist')}
              />
              <BookIcon
                className={!isOnReading ? styles.navIconTrans : styles.navIconFill}
                onClick={() => handleStatusChange('reading')}
              />
              <FinishIcon
                className={!isOnFinished ? styles.navIconTrans : styles.navIconFill}
                onClick={() => handleStatusChange('finished')}
              />
            </div>
            <h2 className={styles.author}>{selectedSuggestion?.author_name?.join(', ') || 'Author unknown'}</h2>
            <p>{getDescription(detailedBook?.description)}</p>

            <div className={styles.infoWrapper}>
              <p><span  className={styles.info}>Pages: </span>{ detailedEditions?.[0]?.number_of_pages || 'unknown' }</p>
              <p><span  className={styles.info}>Published: </span>{ selectedSuggestion?.year || 'unknown' }</p>
              <p><span  className={styles.info}>ISBN13: </span>{ detailedEditions?.[0]?.isbn_13?.[0] || 'unknown' }</p>
              <p><span  className={styles.info}>Language: </span>{
                detailedEditions?.[0]?.languages?.[0]?.key
                  ? detailedEditions[0].languages[0].key.replace('/languages/', '')
                  : 'unknown'
              }</p>
            </div>

            {/* Subjects */}
            <div className={styles.genres}>
              {filteredSubjects.displayedSubjects.map((displayedSub: string) => (
                <p key={displayedSub}>{displayedSub}</p>
                ))
              }
            </div>
          </div>
        </div>
      ) : (
        <p>No book selected. Please use the search bar to find a book.</p>
      )}
    </div>
  )
}
