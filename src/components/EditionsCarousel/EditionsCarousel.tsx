import { RawApiDoc, RawEditionApiDoc } from '@/redux/books/bookTypes';
import styles from './EditionsCarousel.module.css'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';

interface EditionsCarouselProps {
  detailedBook: RawApiDoc | null;
  detailedEditions: RawEditionApiDoc[] | null;
}


export default function EditionsCarousel({detailedBook, detailedEditions}: EditionsCarouselProps) {

  const navigate = useNavigate();
  const workId = detailedBook?.key?.split('/').pop();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if(!detailedEditions || detailedEditions.length === 0) return;

  const editionsWithCover = detailedEditions.filter(edition => edition.covers?.[0])

  const maxEditions = [5, 5, 3, 1] // [superLargeDesktop, desktop, tablet, mobile]

  const getCurrentMaxItems = () => {
    if (windowWidth >= 3000) return maxEditions[0];
    if (windowWidth >= 1024) return maxEditions[1];
    if (windowWidth >= 464) return maxEditions[2];
    return maxEditions[3];
  };

  const needDot = getCurrentMaxItems() < editionsWithCover.length

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: Math.min(maxEditions[0], editionsWithCover.length),
      slidesToSlide: Math.min(maxEditions[0], editionsWithCover.length)
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: Math.min(maxEditions[1], editionsWithCover.length),
      slidesToSlide: Math.min(maxEditions[1], editionsWithCover.length)
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: Math.min(maxEditions[2], editionsWithCover.length),
      slidesToSlide: Math.min(maxEditions[2], editionsWithCover.length)
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: Math.min(maxEditions[3], editionsWithCover.length),
      slidesToSlide: Math.min(maxEditions[3], editionsWithCover.length)
    }
  };



  return (
    <div className={styles.carouselWrapper}>
      <h4 className={styles.editionsHeadline}>more editions:</h4>


      <Carousel
        swipeable={true}
        draggable={false}
        showDots={needDot}
        responsive={responsive}
        ssr={false}
        infinite={false}
        autoPlaySpeed={1000}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
        partialVisible={false}
      >

          {editionsWithCover.map((edition, index) => {

            // Each edition can have multiple covers; we take the first one.
            const coverId = edition.covers?.[0];
            const title = edition.title || detailedBook?.title || 'Untitled Edition';
            const year = edition.publish_date || detailedBook?.title || '';
            const publisher = edition.publishers?.[0] || '';
            const format = edition.physical_format || '';
            const editionId = edition.key
            const id = editionId?.split('/').pop();

            if(!coverId) return null


            return (
              <div
                key={edition.key || index}
                className={styles.editionWrapper}
              >
                <img
                  src={`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`}
                  alt={`${title} cover`}
                  className={styles.covers}
                  onClick={() => navigate(`/book/${id}`, { state: {edition: edition, workId}})}
                />
                {/* <p>{title}</p> */}
                <p>{year}</p>
                <p>{publisher}</p>
                <p>{format}</p>
              </div>
            );
          })}

      </Carousel>
    </div>
  );
}
