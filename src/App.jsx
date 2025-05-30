import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { db } from './firebase';
import { ref, get, update, set, child } from 'firebase/database';
import { useAuth } from './contexts/AuthContext';

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
import FindFriends from './components/FindFriends/FindFriends';

function AppContent() {
  const [reviews, setReviews] = useState([]);
  const { currentUser } = useAuth();

  // load reviews from database when user logs in
  useEffect(() => {
    const loadReviews = async () => {
      if (!currentUser) {
        setReviews([]);
        return;
      }
      
      try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, 'users'));
        
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          let allReviews = [];
          
          // collect reviews from all users
          Object.values(usersData).forEach(user => {
            if (user.reviews && Array.isArray(user.reviews)) {
              allReviews = [...allReviews, ...user.reviews];
            }
          });
          
          // sort reviews by newest first
          allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          setReviews(allReviews);
        }
      } catch (error) {
        console.error("Error loading reviews:", error);
      }
    };
    
    loadReviews();
  }, [currentUser]);

  const addReview = async (newReview) => {
    if (!currentUser) {
      console.error("User must be logged in to add a review");
      return;
    }
    
    try {
      const reviewWithId = {
        ...newReview,
        id: Date.now().toString()
      };
      
      // get the current user's data
      const userRef = ref(db, `users/${currentUser.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        // create or update the reviews array
        const userReviews = userData.reviews ? [...userData.reviews, reviewWithId] : [reviewWithId];
        
        // update the user's reviews in the database
        await update(userRef, { reviews: userReviews });
        
        // update state with the new review
        setReviews(prevReviews => [reviewWithId, ...prevReviews]);
        
        console.log("Review added to user's profile:", reviewWithId);
      } else {
        console.error("User data not found");
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <div>
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
                <Account reviews={reviews} />
              </PrivateRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/community" element={<Community reviews={reviews} />} />
            <Route path="/findfriends" element={<FindFriends />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

