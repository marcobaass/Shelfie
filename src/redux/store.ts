import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './books/searchSlice';
import authorsReducer from './books/authorsSlice';
import suggestionsReducer from './books/suggestionsSlice';

const store = configureStore({
  reducer: {
    search: searchReducer,
    suggestions: suggestionsReducer,
    authors: authorsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
