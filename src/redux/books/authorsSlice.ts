import { createSlice } from '@reduxjs/toolkit';
import { fetchAuthorsThunk } from './booksThunks';
import { AuthorApiDoc } from './bookTypes';

export interface AuthorsState {
  authors: AuthorApiDoc[];
  authorsLoading: boolean;
  error: string | null;
}

const initialState: AuthorsState = {
  authors: [],
  authorsLoading: false,
  error: null,
};

const authorsSlice = createSlice({
  name: 'authors',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthorsThunk.pending, (state) => {
        state.authorsLoading = true;
        state.error = null;
      })
      .addCase(fetchAuthorsThunk.fulfilled, (state, action) => {
        const authorsDocs = action.payload ?? [];
        state.authors = authorsDocs;
        state.authorsLoading = false;
      })
      .addCase(fetchAuthorsThunk.rejected, (state, action) => {
        state.authorsLoading = false;
        state.error = action.payload as string;
      })
  },
});

export default authorsSlice.reducer;
