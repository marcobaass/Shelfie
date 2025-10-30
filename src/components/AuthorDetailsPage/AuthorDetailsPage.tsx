import { fetchAuthorsThunk, fetchAuthorWorksThunk } from "../../redux/books/booksThunks";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import BookList from "../BookList/BookList";
import { Book } from "../../redux/books/bookTypes";
import styles from "./AuthorDetailsPage.module.css";
import { setSelectedSuggestion } from "../../redux/books/suggestionsSlice";

export default function AuthorDetailsPage() {
  const { authorKey } = useParams()
  console.log(authorKey);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [pagesLoaded, setPagesLoaded] = useState(1);

  const dispatch = useDispatch<AppDispatch>()
  const authorData = useSelector((state: RootState) => state.authors.authors)

  const authorWorks = useSelector((state: RootState) => state.authors.authorWorks)
  const navigate = useNavigate()
  const author = authorData[0]

  useEffect(() => {
    setAllBooks([]);
    setPagesLoaded(1);
  }, [authorKey])

  useEffect(() => {
    if (!authorKey) return
    dispatch(fetchAuthorsThunk([authorKey]))
  }, [authorKey, dispatch])

  useEffect(() => {
    if(!authorKey) return
    dispatch(fetchAuthorWorksThunk({authorKey, page: pagesLoaded}))
  }, [authorKey, dispatch, pagesLoaded])


  useEffect(() => {
    if (authorWorks?.entries && author) {
      const newBooks: Book[] = authorWorks.entries
        .filter(entry => entry.covers && entry.covers.length > 0)
        .map(entry => ({
          id: entry.key.replace('/works/', ''),
          title: entry.title,
          author_name: [author.name],
          cover: entry.covers?.[0],
        }));

        if (pagesLoaded === 1) {
          setAllBooks(newBooks)
        } else {
          setAllBooks(prevAllBooks => [...prevAllBooks, ...newBooks])
        }

        if (newBooks.length === 0 && (pagesLoaded * 10) < authorWorks.size) {
          setPagesLoaded(prev => prev + 1);
        }
    }
  }, [authorWorks, author, pagesLoaded])



  if (!author) {
    return <p>Loading author...</p>;
  }

  const bioText = typeof author.bio === 'string' ? author.bio : author.bio?.value;
  const authorImg = author?.photos?.[0]?`https://covers.openlibrary.org/a/id/${author?.photos?.[0]}-M.jpg` : null

  const onBookClick = (book: Book) => {
    dispatch(setSelectedSuggestion(book));
    navigate(`/book/${book.id}`)
  }

  return (
    <>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>{author?.name}</h1>
        {authorImg ? (
          <img src={authorImg} alt="author image" className={styles.authorImage}/>
        ) : (
          ''
        )}
        {author?.death_date && (
          <p className={styles.info}>Born: {author?.birth_date}</p>
        )}
        {author?.death_date && (
          <p className={styles.info}>Died: {author?.death_date}</p>
        )}
        <p>{bioText || 'No Biography available'}</p>
      </div>
      <BookList
        books={allBooks}
        onBookClick={onBookClick}
      />
      {/* Load More button */}
      {authorWorks && (pagesLoaded * 10) < authorWorks.size && (
        <button onClick={() => setPagesLoaded(pagesLoaded + 1)}>
          Load More Books
        </button>
      )}
    </>
  )
}
