import axios from 'axios';
import { RawApiDoc, RawEditionApiDoc, AuthorApiDoc, AuthorWorksResponse } from '../redux/books/bookTypes';

const API_URL = 'https://openlibrary.org';

/**
 * Fetches a list of books from the Open Library search API.
 * @param query The search query string.
 * @param page The number for the pagination
 * @returns A promise that resolves to an array of raw document objects.
 */
export const fetchBooks = async (query: string, page: number): Promise<{ docs: RawApiDoc[]; numFound: number }> => {
  try {
    const response = await axios.get(`${API_URL}/search.json?q=${encodeURIComponent(query)}&page=${page}&limit=10`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch books');
  }
};

/**
 * Fetches a list of books for suggestions from the Open Library search API.
 * @param query The search query string.
 * @returns A promise that resolves to an array of raw document objects.
 */
export const fetchSuggestions = async (query: string): Promise<RawApiDoc[]> => {
  try {
    const response = await axios.get(`${API_URL}/search.json?q=${encodeURIComponent(query)}&limit=5`)
    return response.data.docs;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch suggestions');
  }
}



/**
 * Fetches a single book's details from the Open Library works API.
 * @param bookId The ID of the book work.
 * @returns A promise that resolves to a raw document object.
 */
export const fetchBookDetails = async (bookId: string): Promise<RawApiDoc> => {
  try {
    const response = await axios.get(`${API_URL}/works/${bookId}.json`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch book details');
  }
};

/**
 * Fetches an author's name using their unique key.
 * @param authorKey The author's key (e.g., /authors/OL23919A).
 * @returns A promise that resolves to the author's name or 'Unknown Author'.
 */
export const fetchAuthorNameByKey = async (authorKey: string): Promise<string> => {
  try {
    const response = await axios.get(`${API_URL}${authorKey}.json`);
    return response.data.name || 'Unknown Author';
  } catch (error) {
    console.warn(`Failed to fetch author for key: ${authorKey}`, error);
    return 'Unknown Author';
  }
};

/**
 * Fetches all editions for a specific work.
 * @param workId The ID of the book work.
 * @returns A promise that resolves to an array of raw edition objects.
 */
export const fetchEditions = async (workId: string): Promise<RawEditionApiDoc[]> => {
  try {
    const response = await fetch(`${API_URL}/works/${workId}/editions.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch editions from editions API');
    }
    const data = await response.json();
    return data.entries;
  } catch (error) {
    console.error('Error fetching editions:', error);
    return []; // Return an empty array to match the expected return type
  }
};

/**
 * Fetches multiple authors' details using their unique keys.
 * @param authorKeys Array of author keys (e.g., ['/authors/OL23919A']).
 * @returns A promise that resolves to an array of author objects.
 */
export const fetchAuthors = async (authorKeys: string[]): Promise<AuthorApiDoc[]> => {
  try {
    const promises = authorKeys.map(async (authorKey) => {
      const cleanKey = authorKey.replace('/authors/', '');
      const response = await axios.get(`${API_URL}/authors/${cleanKey}.json`);
      return response.data;
    });

    return await Promise.all(promises);
  } catch (error) {
    console.error('Failed to fetch authors:', error);
    throw new Error('Failed to fetch authors');
  }
};

/**
 * Fetches multiple authors works using their unique keys.
 * @param authorKeys Array of books
 * @returns A promise that resolves to an array of book objects.
 */
export const fetchAuthorWorks = async (authorKey: string, page: number): Promise<AuthorWorksResponse> => {
  try {
    const url = `${API_URL}/authors/${authorKey.replace('/authors/', '')}/works.json?limit=10&offset=${(page - 1) * 10}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error){
    console.error('Failed to fetch author works:', error);
    throw new Error('Failed to fetch author works');
  }
};
