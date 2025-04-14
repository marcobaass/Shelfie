import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBooks, fetchSuggestions } from '../../API/api';

interface Book {
  id: string;
  title: string;
  author_name: string[];
  cover?: number;
  year?: number;
  synopsis?: string;
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
  { rejectValue: string }
>(
  "books/fetchSuggestions",
  async (query, { rejectWithValue }) => {
    try {
      const docs = await fetchSuggestions(query);
      console.log("API Raw Response1:", docs);

      console.log("Whats going on?")

      if (Array.isArray(docs) && docs.length > 0) {
        const mappedDocs = docs.map((book) => {
          // Log book properties for debugging
          console.log("Book Object:", book);
          console.log("Book Keys:", Object.keys(book));
          console.log("Key Property:", book.key);

          // Safely extract the ID - handle multiple formats
          let id;
          if (typeof book.key === 'string') {
            // Handle format like "/works/1" by extracting just the "1"
            if (book.key.includes('/')) {
              id = book.key.split('/').pop();
            } else {
              // If it's already a simple string like "1", use it directly
              id = book.key;
            }
          }

          const mappedBook = {
            id: id,  // Use the extracted ID
            title: book.title,
            author_name: book.author_name || ["Unknown Author"],
            cover: book.cover_i,
            year: book.first_publish_year,
            synopsis: book.synopsis || "No synopsis available",
          };

          console.log("Mapped Book:", mappedBook);
          return mappedBook;
        });

        return { docs: mappedDocs };
      } else {
        return { docs: [] };
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);
