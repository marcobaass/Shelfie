import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store'
import { AuthorApiDoc } from '@/redux/books/bookTypes';
import styles from './AuthorDetailsPage.module.css';
import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchAuthorsThunk } from "../../redux/books/booksThunks";

export default function AuthorDetailsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const location = useLocation();


  const detailedAuthor = useSelector((state: RootState): AuthorApiDoc | null => state.authors.detailedAuthor);
  const detailsLoading = useSelector((state: RootState): boolean => state.suggestions.detailsLoading);

  if (detailsLoading) {
    return <p>Loading author details...</p>;
  }

  // todo
  const imgLink = passedEdition?.covers?.[0]?`https://covers.openlibrary.org/b/id/${passedEdition?.covers?.[0]}-M.jpg`
                  : selectedSuggestion?.cover? `https://covers.openlibrary.org/b/id/${selectedSuggestion.cover}-M.jpg`
                  : null;

  return (
    <div>
      Hello World
    </div>
  )
}
