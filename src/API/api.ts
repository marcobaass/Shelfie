import axios from 'axios';

const API_URL = 'https://openlibrary.org/search.json';

interface Book {
  title: string;
}

export const fetchBooks = async (query: string) => {
  try {
    const response = await axios.get(`${API_URL}?q=${query}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch books');
  }
};

export const fetchSuggestions = async (query: string) => {
  try {
    const response = await axios.get(`${API_URL}?q=${query}&limit=5`)
    return response.data.docs;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch suggestions');
  }
}
