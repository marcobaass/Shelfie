import { Book } from "@/redux/books/bookTypes";
import SearchBar from "../SearchBar/SearchBar";
import styles from './StartPage.module.css';
import { useNavigate } from "react-router-dom";

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
      <h1 className={styles.welcomeHeading}>Welcome to Shelfie</h1>
      <h2>Organize and discover new reading adventures</h2>
      <h3>Find youre first book</h3>
      <SearchBar
        onSearchSubmit={handleGeneralSearch}
        onSelectSuggestion = {handleBookSelection}
      />
    </div>
  )
}
