import styles from './NavBar.module.css'
import { Link } from 'react-router-dom'
import HeartIcon from '../../assets/icons/heartIcon.svg?react';

export default function NavBar() {

  return (
    <nav className={styles.nav}>
      <Link to='/' className={styles.navLogo}>
        <span className={styles.serif}>M</span>y Shelves
      </Link>
      <div className={styles.menu}>
        <Link to='/wishlist'>
          <HeartIcon className={styles.navIcon} />
          Wishlist
        </Link>
        <Link to='/reading'>
          Reading
        </Link>
        <Link to='/finished'>
          Finished
        </Link>
      </div>
    </nav>
  )
}
