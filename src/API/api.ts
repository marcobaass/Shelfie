import axios from 'axios';

const API_URL = 'https://openlibrary.org/search.json';

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



export const fetchBookDetails = async (bookId: string) => {
  console.log(bookId);
  try {
    const response = await axios.get(`https://openlibrary.org/works/${bookId}.json`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch book details');
  }
};
