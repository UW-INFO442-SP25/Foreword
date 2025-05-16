import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Landing() {
    const { currentUser } = useAuth();

    return (
        <div className="landing-container">
            <div className="landing-hero">
                <h1>Welcome to Foreword</h1>
                <p className="landing-subtitle">Your personal reading companion</p>
                <div className="landing-cta">
                    {currentUser ? (
                        <Link to="/feed" className="landing-button primary">Go to Feed</Link>
                    ) : (
                        <Link to="/login" className="landing-button primary">Get Started</Link>
                    )}
                    <Link to="/about" className="landing-button secondary">Learn More</Link>
                </div>
            </div>
            
            <div className="landing-features">
                <div className="feature-card">
                    <div className="feature-icon">📚</div>
                    <h3>Track Your Reading</h3>
                    <p>Keep a record of books you've read and want to read</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🔍</div>
                    <h3>Discover Books</h3>
                    <p>Find new books based on your interests and friends' recommendations</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">💬</div>
                    <h3>Connect with Friends</h3>
                    <p>Share your thoughts and discuss books with others</p>
                </div>
            </div>
        </div>
    );
} 