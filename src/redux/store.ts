import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './books/searchSlice';
import suggestionsReducer from './books/suggestionsSlice';

const store = configureStore({
  reducer: {
    search: searchReducer,
    suggestions: suggestionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
