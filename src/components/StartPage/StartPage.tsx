import SearchBar from "../SearchBar/SearchBar";
import styles from './StartPage.module.css';

export default function StartPage() {
  return(
    <div className={styles.startPageContainer}>
      <h1 className={styles.welcomeHeading}>Welcome to Shelfie</h1>
      <SearchBar />
    </div>
  )
}
