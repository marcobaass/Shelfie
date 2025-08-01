// import { useState } from 'react'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

import MainLayout from './components/MainLayout/MainLayout'
import StartPage from './components/StartPage/StartPage';
import WishListPage from './components/WishListPage/WishListPage';
import ReadingPage from './components/ReadingPage/ReadingPage';
import FinishedPage from './components/FinishedPage/FinishedPage';
import SearchListPage from './components/SearchListPage/SearchListPage';
import BookDetailsPage from './components/BookDetailsPage/BookDetailsPage';

const App: React.FC = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />} >
          <Route index element={<StartPage />} />
          <Route path="wishlist" element={<WishListPage />} />
          <Route path="reading" element={<ReadingPage />} />
          <Route path="finished" element={<FinishedPage />} />
          <Route path="search" element={<SearchListPage />} />
          <Route path="book/:id" element={<BookDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
