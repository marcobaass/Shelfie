import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBooks, fetchSuggestions } from '../../API/api';

interface Book {
  id: string;
  title: string;
  author_name: string[];
}

interface FetchBooksResponse {
  docs: Book[];
}

interface FetchSuggestionsResponse {
  docs: Book[]
}

export const fetchBooksThunk = createAsyncThunk<
  FetchBooksResponse,
  string,
  { rejectValue: string}
  >(
  'books/fetchBooks',
  async (query, { rejectWithValue }) => {
    try {
      const data = await fetchBooks(query);
      return { docs: data.docs };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchSuggestionsThunk = createAsyncThunk<
  FetchSuggestionsResponse,
  string,
  { rejectValue: string}
  >(
  'books/fetchSuggestions',
  async (query, { rejectWithValue }) => {
    try {
      const docs = await fetchSuggestions(query);
      console.log({ docs: docs.map((book) => ({ title: book.title, author_name: book.author_name })) });
      return { docs: docs.map((book) => ({ title: book.title, author_name: book.author_name })) };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);
