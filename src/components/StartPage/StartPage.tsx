import { Book } from "@/redux/books/bookTypes";
import SearchBar from "../SearchBar/SearchBar";
import styles from './StartPage.module.css';
import { useNavigate } from "react-router-dom";
import BookIconAnimated from '../../assets/icons/bookIconAnimated.svg?react';

export default function StartPage() {
  const navigate = useNavigate()

  const handleGeneralSearch = (query: string) => {
    navigate(`/search/?q=${encodeURIComponent(query)}`)
  }

  const handleBookSelection = (book: Book) => {
    navigate(`/book/${book.id}`)
  }

  return(
    <div className={styles.startPageContainer}>
      <h1 className={styles.welcomeHeading}><span className={styles.serif}>W</span>elcome to Shelfie</h1>
      <h2>Find youre first book</h2>
      <SearchBar
        onSearchSubmit={handleGeneralSearch}
        onSelectSuggestion = {handleBookSelection}
        />
      <BookIconAnimated className={styles.bookIconAnimated} />
      <h3>Organize and discover new reading adventures</h3>
    </div>
  )
}
