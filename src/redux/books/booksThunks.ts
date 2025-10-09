import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchBooks,
  fetchSuggestions,
  fetchBookDetails,
  fetchEditions,
} from '../../API/api';
import { Book, RawApiDoc, RawEditionApiDoc } from './bookTypes';
import { mapRawDocToBook } from '../../utils/bookUtils'

interface FetchBooksResponse {
  docs: Book[];
  numFound: number;
}

interface FetchSuggestionsResponse {
  docs: Book[]
}

interface RawBooksApiResponse {
  docs: RawApiDoc[];
  numFound: number;
}

interface FetchBooksArgs {
  query: string;
  page?: number;
  limit?: number;
}

export const fetchBooksThunk = createAsyncThunk<
  FetchBooksResponse,
  FetchBooksArgs,
  { rejectValue: string}
  >(
  'search/fetchBooks',
  async ({ query, page = 1 }, { rejectWithValue }) => {
    try {
      // 1. Fetch RAW data from API
      const rawData: RawBooksApiResponse = await fetchBooks(query, page);

      // 2. Validate RAW data structure
      if (!rawData || !Array.isArray(rawData.docs) || typeof rawData.numFound !== 'number') {
        console.error("Unexpected API response structure in fetchBooksThunk:", rawData);
        return rejectWithValue('Invalid API response format');
      }

      // 3. Transform RAW docs using the helper function
      const transformedDocs: Book[] = rawData.docs
        .map(mapRawDocToBook) // Use the imported helper for each item
        .filter((book): book is Book => book !== null); // Filter out invalid items

      // 4. Return the final payload with TRANSFORMED docs
      return {
        docs: transformedDocs,    // This is now Book[]
        numFound: rawData.numFound
      };

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching/transforming books:", error);
        return rejectWithValue(error.message);
      }
      console.error("Unknown error fetching/transforming books:", error);
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchSuggestionsThunk = createAsyncThunk<
  FetchSuggestionsResponse,
  string,
  { rejectValue: string }
>(
  "suggestions/fetchSuggestions",
  async (query, { rejectWithValue }) => {
    try {
      const rawDocs: RawApiDoc[] = await fetchSuggestions(query);

      if (!Array.isArray(rawDocs)) { // <<< Changed validation here
        // Log the actual received data for debugging
        console.error("Unexpected API response structure in fetchSuggestionsThunk (expected array):", rawDocs);
        return rejectWithValue('Invalid API response format for suggestions (expected array)');
      }

      // Transform RAW docs using the helper function
      const transformedDocs: Book[] = rawDocs
      .map(mapRawDocToBook) // Use the imported helper for each item
      .filter((book): book is Book => book !== null); // Filter out invalid items

      return {
        docs: transformedDocs // This is now Book[]
      };

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching/transforming suggestions:", error);
        return rejectWithValue(error.message);
      }
      console.error("Unknown error fetching/transforming suggestions:", error);
      return rejectWithValue("An unknown error occurred");
    }
  }
);

//
export const fetchBookDetailsThunk = createAsyncThunk<
  RawApiDoc,
  string,
  { rejectValue: string }
>(
  'books/fetchBookDetails',
  async (bookId, { rejectWithValue }) => {
    try {
      const rawDetails: RawApiDoc = await fetchBookDetails(bookId);
      return rawDetails;

    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }
);

// Thunk for fetching all editions of a specific work
export const fetchEditionsThunk = createAsyncThunk<
  RawEditionApiDoc[],
  string,
  { rejectValue: string }
>('books/fetchEditions', async (workId, { rejectWithValue }) => {
  try {
    const rawEditions: RawEditionApiDoc[] = await fetchEditions(workId);
    return rawEditions;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'An unkown error occured'
    );
  }
});
