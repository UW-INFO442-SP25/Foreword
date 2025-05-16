import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import About from './components/About';
import Account from './components/Account';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import Landing from './components/Landing';
import Settings from './components/Settings';

export default function App() {
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
              <Route path="/account" element={
                <PrivateRoute>
                  <Account />
                </PrivateRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Landing />} />
            </Routes>
          </main>
        </Router>
      </AuthProvider>
    </div>
  );
}

