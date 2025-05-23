import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit'; // PayloadAction importieren
import searchReducer from '../redux/books/searchSlice';
import suggestionsReducer, { SuggestionsState } from '../redux/books/suggestionsSlice'; // SuggestionsState für Store-Typ
import { fetchBooksThunk, fetchSuggestionsThunk } from '../redux/books/booksThunks';
import * as api from '../API/api';
import { RawApiDoc, Book } from '../redux/books/bookTypes';
import { mapRawDocToBook } from '../../src/utils/bookUtils'; // Pfad anpassen!

// VitestMock Typ nicht mehr benötigt

vi.mock('../API/api');

const mockedFetchBooks = vi.mocked(api.fetchBooks);
const mockedFetchSuggestions = vi.mocked(api.fetchSuggestions);

describe('fetchBooksThunk', () => {
  // Typ für den Store expliziter machen, falls nötig, aber oft nicht erforderlich
  let store: ReturnType<typeof configureStore<{search: ReturnType<typeof searchReducer>}>>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        search: searchReducer,
      },
    });
    vi.clearAllMocks();
  });

  it('dispatches fulfilled action with transformed data when API call is successful', async () => {
    const mockRawDocsData: RawApiDoc[] = [
      { key: '/works/OL123W', title: 'Raw Book 1', author_name: ['Author A'], first_publish_year: 2020, cover_i: 101 },
      { key: '/works/OL456W', title: 'Raw Book 2', author_name: ['Author B'], first_publish_year: 2021, cover_i: 102 },
    ];
    const mockNumFound = mockRawDocsData.length;

    mockedFetchBooks.mockResolvedValue({ docs: mockRawDocsData, numFound: mockNumFound });

    const expectedTransformedBooks: Book[] = mockRawDocsData
      .map(doc => mapRawDocToBook(doc))
      .filter((book): book is Book => book !== null);

    // Das Ergebnis von await store.dispatch(thunk) IST die Action
    const action = await store.dispatch(fetchBooksThunk('react'));

    expect(action.type).toBe('search/fetchBooks/fulfilled');
    expect(mockedFetchBooks).toHaveBeenCalledWith('react');

    // Type Guard, um TypeScript zu helfen, den Payload zu erkennen
    if (fetchBooksThunk.fulfilled.match(action)) {
      expect(action.payload).toEqual({
        docs: expectedTransformedBooks,
        numFound: mockNumFound,
      });
    } else {
      // Sollte nicht passieren, wenn der Typ 'search/fetchBooks/fulfilled' ist
      throw new Error('Action was not fulfilled for fetchBooksThunk');
    }
  });

  it('dispatches rejected action when API call fails', async () => {
    const errorMessage = 'Network error';
    mockedFetchBooks.mockRejectedValue(new Error(errorMessage));

    const action = await store.dispatch(fetchBooksThunk('react'));
    expect(action.type).toBe('search/fetchBooks/rejected');

    // Type Guard für rejected action
    if (fetchBooksThunk.rejected.match(action)) {
      expect(action.payload).toBe(errorMessage);
      // Optional: auch action.error prüfen, wenn es für den Test relevant ist
      // expect(action.error.message).toBe(errorMessage);
    } else {
      throw new Error('Action was not rejected for fetchBooksThunk');
    }
  });
});

describe('fetchSuggestionsThunk', () => {
  let store: ReturnType<typeof configureStore<{suggestions: SuggestionsState}>>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        suggestions: suggestionsReducer,
      },
    });
    vi.clearAllMocks();
  });

  it('dispatches fulfilled action with transformed data when API call is successful', async () => {
    const mockRawApiSuggestionsData: RawApiDoc[] = [
      { key: "sugg1", title: "Suggestion 1", author_name: ["Author S1"], cover_i: 707, first_publish_year: 1999 },
      { key: "sugg2", title: "Suggestion 2", author_name: ["Author S2"] }
    ];

    mockedFetchSuggestions.mockResolvedValue(mockRawApiSuggestionsData);

    const expectedMappedSuggestions: Book[] = mockRawApiSuggestionsData
      .map(doc => mapRawDocToBook(doc))
      .filter((book): book is Book => book !== null);

    const action = await store.dispatch(fetchSuggestionsThunk('test query'));

    expect(action.type).toBe('suggestions/fetchSuggestions/fulfilled');

    if (fetchSuggestionsThunk.fulfilled.match(action)) {
      expect(action.payload).toEqual({ docs: expectedMappedSuggestions });
    } else {
      throw new Error('Action was not fulfilled for fetchSuggestionsThunk');
    }
    expect(mockedFetchSuggestions).toHaveBeenCalledWith('test query');
  });

  it('dispatches rejected action when API call fails', async () => {
    const errorMessage = 'Network error';
    mockedFetchSuggestions.mockRejectedValue(new Error(errorMessage));

    const action = await store.dispatch(fetchSuggestionsThunk('react'));
    expect(action.type).toBe('suggestions/fetchSuggestions/rejected');

    if (fetchSuggestionsThunk.rejected.match(action)) {
      expect(action.payload).toBe(errorMessage);
    } else {
      throw new Error('Action was not rejected for fetchSuggestionsThunk');
    }
  });
});
