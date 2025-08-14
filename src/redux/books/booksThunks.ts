import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBooks, fetchSuggestions, fetchBookDetails } from '../../API/api';
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

//
export const fetchBookDetailsThunk = createAsyncThunk<
  // The first generic type parameter is the expected payload for the 'fulfilled' action.
  // We expect a single RawApiDoc object with all the book's details.
  RawApiDoc,
  // The second generic type parameter is the argument that the thunk will accept when dispatched.
  // The unique book ID is a string, which is passed here.
  string,
  // The third generic type parameter is an optional configuration for the thunk.
  // It specifies the payload type for the 'rejected' action, which is a simple string.
  { rejectValue: string }
>(

  // String used from Redux for unique actiontypes for pending, fullfilled, rejected
  'books/fetchBookDetails',

  // This is the main payload creator function. It's marked as 'async' because it will
  // perform an asynchronous API call.
  // - 'bookId' is the string argument passed to the thunk.
  // - '{ rejectWithValue }' is a helper function from Redux Toolkit used to manually
  //   dispatch a 'rejected' action with a custom payload.
  async (bookId, { rejectWithValue }) => {
    // The code in the 'try' block is executed, and if an error occurs, it jumps to 'catch'.
    try {
      // call to api.ts for fetchBookDetails()
      const rawData: RawApiDoc = await fetchBookDetails(bookId);
      // If the API call is successful, this data is returned. This returned value
      // becomes the payload for the 'fulfilled' action.
      return rawData;

    } catch (error: unknown) {
      return rejectWithValue(
        // If the 'error' is an instance of the standard JavaScript 'Error' object,
        // we use its specific 'message'.
        error instanceof Error ? error.message : 'An unknown error occurred'
        // Otherwise, for any other type of error (e.g., a network error), we provide
        // a generic, user-friendly fallback message.
      );
    }
  }
);
