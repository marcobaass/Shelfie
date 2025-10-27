import { createSlice } from '@reduxjs/toolkit';
import { fetchAuthorsThunk, fetchAuthorWorksThunk,  } from './booksThunks';
import { AuthorApiDoc, AuthorWorksResponse } from './bookTypes';

export interface AuthorsState {
  authors: AuthorApiDoc[];
  authorsLoading: boolean;
  authorWorks: AuthorWorksResponse | null;
  worksLoading: boolean;
  error: string | null;
}

const initialState: AuthorsState = {
  authors: [],
  authorsLoading: false,
  authorWorks: null,
  worksLoading: false,
  error: null,
};

const authorsSlice = createSlice({
  name: 'authorsWorks',
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

      .addCase(fetchAuthorWorksThunk.pending, (state) => {
        state.worksLoading = true;
        state.error = null;
      })
      .addCase(fetchAuthorWorksThunk.fulfilled, (state, action) => {
        state.authorWorks = action.payload;
        state.worksLoading = false;
      })
      .addCase(fetchAuthorWorksThunk.rejected, (state, action) => {
        state.worksLoading = false;
        state.error = action.payload as string;
      })
  },
});

export default authorsSlice.reducer;
