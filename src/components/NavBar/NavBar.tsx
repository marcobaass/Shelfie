import styles from './NavBar.module.css'
// import { Link } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import HeartIcon from '../../assets/icons/heartIcon.svg?react';
import BookIcon from '../../assets/icons/bookIcon.svg?react';
import FinishIcon from '../../assets/icons/finishIcon.svg?react';
import { Squash as Hamburger } from 'hamburger-react';
import { useState } from 'react';


export default function NavBar() {
  const [isOpen, setOpen] = useState(false)

  return (
    <>
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

      <div className={styles.hamburgerIconContainer}>
        <Hamburger toggled={isOpen} toggle={setOpen} label="Show menu" />
      </div>


      <div className={`${styles.hamburgerContainer} ${isOpen ? styles.open : ''}`}>
        <NavLink to='/' onClick={() => setOpen(false)} className={styles.hamburgerLink}>
          <h2>home</h2>
        </ NavLink>

        <NavLink to='/wishlist' onClick={() => setOpen(false)} className={styles.hamburgerLink}>
          <h2>wishlist</h2>
        </ NavLink>

        <NavLink to='/reading' onClick={() => setOpen(false)} className={styles.hamburgerLink}>
          <h2>reading</h2>
        </ NavLink>

        <NavLink to='/finished' onClick={() => setOpen(false)} className={styles.hamburgerLink}>
          <h2>finished</h2>
        </ NavLink>
      </div>
    </>
  )
}
