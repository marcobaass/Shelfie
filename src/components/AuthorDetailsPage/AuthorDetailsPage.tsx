import { fetchAuthorsThunk, fetchAuthorWorksThunk } from "../../redux/books/booksThunks";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import BookList from "../BookList/BookList";
import { Book } from "../../redux/books/bookTypes";
import styles from "./AuthorDetailsPage.module.css";
import { setSelectedSuggestion } from "../../redux/books/suggestionsSlice";
import searchGif from "../../assets/search.gif";

export default function AuthorDetailsPage() {
  const { authorKey } = useParams()
  const [page, setPage] = useState(1);

  const dispatch = useDispatch<AppDispatch>()
  const authorData = useSelector((state: RootState) => state.authors.authors)

  useEffect(() => {
    if (!authorKey) return
    dispatch(fetchAuthorsThunk([authorKey]))
  }, [authorKey, dispatch])

  useEffect(() => {
    if(!authorKey) return
    dispatch(fetchAuthorWorksThunk({authorKey, page}))
  }, [authorKey, dispatch, page])

  const author = authorData[0]

  const authorWorks = useSelector((state: RootState) => state.authors.authorWorks)

  const navigate = useNavigate()

  if (!author) {
    return(
      <div className={styles.searchGif}>
        <img src={searchGif} alt="" aria-hidden="true"/>
      </div>
    )
  }

  const bioText = typeof author.bio === 'string' ? author.bio : author.bio?.value;
  const authorImg = author?.photos?.[0]?`https://covers.openlibrary.org/a/id/${author?.photos?.[0]}-M.jpg` : null

  const books: Book[] = authorWorks?.entries?.map(entry => ({
  id: entry.key.replace('/works/', ''),
  title: entry.title,
  author_name: [author.name],
  cover: entry.covers?.[0]
})) ?? [];

  const numFound = authorWorks?.size ?? 0;
  const booksPerPage = 10;
  const totalPages = Math.ceil(numFound / booksPerPage);



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
        <p className={styles.descriptionText}>{bioText || 'No Biography available'}</p>
      </div>
      <BookList
        books={books}
        onBookClick={onBookClick}
        page={page}
        setPage={setPage}
        numFound={numFound}
        totalPages={totalPages}
      />
    </>
  )
}

