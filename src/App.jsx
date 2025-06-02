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
import UserProfile from './components/UserProfile/UserProfile';

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
      const [reviewsSnapshot, usersSnapshot] = await Promise.all([
        get(child(dbRef, 'reviews')),
        get(child(dbRef, 'users'))
      ]);

      if (reviewsSnapshot.exists() && usersSnapshot.exists()) {
        const reviewsData = reviewsSnapshot.val();
        const usersData = usersSnapshot.val();

        const reviewsArray = Object.values(reviewsData).filter(review => {
          const reviewer = usersData[review.reviewerId];
          return reviewer?.public || review.reviewerId === currentUser.uid;
        });

        reviewsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(reviewsArray);
      }

      // ✅ Update streak
      await updateDailyStreak();

    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };
    loadReviews();
}, [currentUser]);

  const addReview = async (newReview) => {
    if (!currentUser) {
      alert("User must be logged in to add a review");
      return;
    }

  const updateDailyStreak = async () => {
  if (!currentUser) return;

  const userRef = ref(db, `users/${currentUser.uid}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) return;

  const userData = snapshot.val();
  const last = userData.lastActivityDate;
  const streak = userData.streakCount || 0;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yDay = yesterday.toISOString().split('T')[0];

  let newStreak = 1;
  if (last === today) return; // already updated today
  else if (last === yDay) newStreak = streak + 1;

  await update(userRef, {
    lastActivityDate: today,
    streakCount: newStreak
  });

  console.log(`Streak updated: ${newStreak} days`);
  };


    try {
      const reviewWithId = {
        ...newReview,
        id: Date.now().toString(),
        reviewerId: currentUser.uid
      };

      // Add review to reviews node
      const reviewRef = ref(db, `reviews/${reviewWithId.id}`);
      await set(reviewRef, reviewWithId);

      // Update user's reviewIds array
      const userRef = ref(db, `users/${currentUser.uid}`);
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        const userReviews = userData.reviewIds || [];
        await update(userRef, {
          reviewIds: [...userReviews, reviewWithId.id]
        });
      }

      // update state with the new review
      setReviews(prevReviews => [reviewWithId, ...prevReviews]);

      console.log("Review added successfully:", reviewWithId);
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
            <Route path="/home" element={<Home reviews={reviews} currentUser={currentUser} />} />
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
            <Route path="/community" element={<Community reviews={reviews} currentUser={currentUser} />} />
            <Route path="/findfriends" element={<FindFriends />} />
            <Route path="/user/:userId" element={<UserProfile />} />
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

