import { Book } from "@/redux/books/bookTypes";
import SearchBar from "../SearchBar/SearchBar";
import styles from './StartPage.module.css';
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BookIconAnimated from '../../assets/icons/bookIconAnimated.svg?react';

import { gsap } from 'gsap';
import { DrawSVGPlugin } from "gsap/all";

gsap.registerPlugin(DrawSVGPlugin);

export default function StartPage() {
  const navigate = useNavigate()
  const bookIconRef = useRef(null);

  const handleGeneralSearch = (query: string) => {
    navigate(`/search/?q=${encodeURIComponent(query)}`)
  }

  const handleBookSelection = (book: Book) => {
    navigate(`/book/${book.id}`)
  }

  useEffect (() => {
    // Ensure the ref has a value meaning is mounted
    if (bookIconRef) {
      // Use gsap.utils.selector to find elements *within* the ref'd SVG
      const q = gsap.utils.selector(bookIconRef);

      // Target all 'path' elements within the SVG
      // Set their stroke to be fully "undrawn" initially (0% start, 0% end)
      gsap.set(q('path'), { drawSVG: '0% 0%' })

      // Animate the paths from "undrawn" to fully "drawn" (0% start, 100% end)
      gsap.to(q('path'), {
        drawSVG: '0% 100%',
        duration: 2,
        stagger: 0.1,
        ease: 'power1.out',
        delay: 0.5
      })
    }
  }, [])

  return(
    <div className={styles.startPageContainer}>
      <h1 className={styles.welcomeHeading}><span className={styles.serif}>W</span>elcome to Shelfie</h1>
      <h2>Find youre first book</h2>
      <SearchBar
        onSearchSubmit={handleGeneralSearch}
        onSelectSuggestion = {handleBookSelection}
        />
      <BookIconAnimated className={styles.bookIconAnimated} ref={bookIconRef}/>
      <h3>Organize and discover new reading adventures</h3>
    </div>
  )
}
