import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';

import About from './components/About/About';
import Account from './components/Account/Account';
import Login from './components/Login/Login';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import Landing from './components/Landing/Landing';
import Settings from './components/Settings/Settings';
import Home from './components/Home/Home';
import CreateReview from './components/CreateReview/CreateReview';
import Community from './components/Community/Community';
import InputBook from './components/InputBook/InputBook';
import BookDetail from './components/BookDetail/BookDetail';

export default function App() {
  const [reviews, setReviews] = useState([]);

  const addReview = (newReview) => {
    console.log("Adding new review:", newReview);
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };

  useEffect(() => {
    console.log("Current reviews:", reviews);
  }, [reviews]);

  return (
    <div>
      <AuthProvider>
        <Router>
          <header>
            <Navbar />
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/home" element={<Home reviews={reviews} />} />
              <Route path="/CreateReview" element={<CreateReview addReview={addReview} />} />
              <Route path="/InputBook" element={<InputBook />} />
              <Route path="/book/:bookId" element={<BookDetail reviews={reviews} />} />
              <Route path="/account" element={
                <PrivateRoute>
                  <Account />
                </PrivateRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/community" element={<Community />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </Router>
      </AuthProvider>
    </div>
  );
}

