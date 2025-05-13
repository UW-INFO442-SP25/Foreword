import React from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import About from './components/About';
import Settings from './components/Settings';
import Review from './components/Review';
import Request from './components/Request';
import Account from './components/Account';
import Comment from './components/Comment';
import CreateReview from './components/CreateReview';
export default function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/account" element={<Account />} />
          <Route path="/create-review" element={<CreateReview />} />
        </Routes>
        <About />
      </Router>
    </div>
  );
}

