import styles from './NavBar.module.css'
// import { Link } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import HeartIcon from '../../assets/icons/heartIcon.svg?react';
import BookIcon from '../../assets/icons/bookIcon.svg?react';
import FinishIcon from '../../assets/icons/finishIcon.svg?react';

export default function NavBar() {

  return (
    <nav className={styles.nav}>
      <NavLink to='/' className={styles.navLogo}>
        <span className={styles.serif}>M</span>y Shelves
      </NavLink>
      <div className={styles.menu}>
        <NavLink
          to='/wishlist'
          className={({ isActive }) =>
            isActive ? `${styles.navItems} ${styles.activeLink}` : styles.navItems
          }
        >
          <HeartIcon className={styles.navIcon} />
          <span>Wishlist</span>
        </NavLink>
        <NavLink
          to='/reading'
          className={({ isActive}) =>
            isActive ? `${styles.navItems} ${styles.activeLink}` : styles.navItems
          }
        >
          <BookIcon className={styles.navIcon} />
          <span>Reading</span>
        </NavLink>
        <NavLink
          to='/finished'
          className={({ isActive}) =>
            isActive ? `${styles.navItems} ${styles.activeLink}` : styles.navItems
          }
        >
          <FinishIcon className={styles.navIcon}
        />
          <span>Finished</span>
        </NavLink>
      </div>
    </nav>
  )
}
