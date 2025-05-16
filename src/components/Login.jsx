import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleGoogleSignIn() {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      setError('Failed to sign in with Google: ' + error.message);
    }

    setLoading(false);
  }

  return (
    <div className="form-container">
      <h2>Sign In</h2>
      {error && <div className="error">{error}</div>}
      <button 
        className="btn-google" 
        disabled={loading} 
        onClick={handleGoogleSignIn}
      >
        Sign in with Google
      </button>
    </div>
  );
} 