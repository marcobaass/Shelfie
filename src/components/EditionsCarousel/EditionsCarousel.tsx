import { RawApiDoc, RawEditionApiDoc } from '@/redux/books/bookTypes';
import styles from './EditionsCarousel.module.css'

interface EditionsCarouselProps {
  detailedBook: RawApiDoc | null;
  detailedEditions: RawEditionApiDoc[] | null;
}

export default function EditionsCarousel({detailedBook, detailedEditions}: EditionsCarouselProps) {

  if(!detailedEditions || detailedEditions.length === 0) return;

  return (
    <>
      <h4>more editions:</h4>
      <div className={styles.carousel}>
        {detailedEditions.map((edition, index) => {
          // Each edition can have multiple covers; we take the first one.
          const coverId = edition.covers?.[0];
          const title = edition.title || detailedBook?.title || 'Untitled Edition';
          const year = edition.publish_date || detailedBook?.title || '';
          const publisher = edition.publishers || '';
          const format = edition.physical_format || '';

          return (
              <div
                key={edition.key || index}
                className={styles.editions}
                >
                <div>
                  {coverId ? (
                    <img
                      src={`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`}
                      alt={`${title} cover`}
                      className={styles.covers}
                    />
                  ) : (
                    <div style={{ width: '100px', height: '150px', backgroundColor: '#ccc' }}>
                      No cover
                    </div>
                  )}
                  <p>{title}</p>
                  <p>{year}</p>
                  <p>{publisher}</p>
                  <p>{format}</p>
                </div>
              </div>
          );
        })}
      </div>
    </>
  );
}
