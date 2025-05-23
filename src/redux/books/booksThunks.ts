import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBooks, fetchSuggestions } from '../../API/api';
import { Book, RawApiDoc } from './bookTypes';
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

export const fetchBooksThunk = createAsyncThunk<
  FetchBooksResponse,
  string,
  { rejectValue: string}
  >(
  'search/fetchBooks',
  async (query, { rejectWithValue }) => {
    try {
      // 1. Fetch RAW data from API
      const rawData: RawBooksApiResponse = await fetchBooks(query);

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
