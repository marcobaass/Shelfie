import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store'

export default function SearchResults() {
  const selectedSuggestion = useSelector((state: RootState) => state.books.selectedSuggestion)
  console.log("Redux State - selectedSuggestion:", selectedSuggestion);

  const imgLink = selectedSuggestion?.cover
                  ? `https://covers.openlibrary.org/b/id/${selectedSuggestion.cover}-M.jpg`
                  : null;

  console.log('Img-Link: ', imgLink)

  return (
    <div>
      {selectedSuggestion ? (
        <div>
          <h2>{selectedSuggestion.title}</h2>
          <p>Autor(en): { selectedSuggestion.author_name }</p>
          <p>Published: { selectedSuggestion.year || 'unknown' }</p>
          {selectedSuggestion.cover && (
            <img
              key={selectedSuggestion.cover}
              src={`https://covers.openlibrary.org/b/id/${selectedSuggestion.cover}-M.jpg`}
              alt={`${selectedSuggestion.title} cover`}
            />
          )}
          <p>{ selectedSuggestion.synopsis }</p>
        </div>
      ) : (
        <p>Keine Auswahl</p>
      )}
    </div>
  )
}
