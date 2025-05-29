import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Review from '../Review/Review';
import './Account.css';

export default function Account({ reviews = [], updateReviewLikes }) {
    const [error, setError] = useState('');
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        setError('');

        try {
            await logout();
            navigate('/login');
        } catch (error) {
            setError('Failed to log out: ' + error.message);
        }
    }

    const userReviews = reviews.filter(review => 
        review.reviewerId === currentUser?.uid || 
        review.reviewerEmail === currentUser?.email
    );

    return (
        <div className="account-container">
            <h1>My Account</h1>
            {error && <div className="error">{error}</div>}
            <div className="profile-card">
                <div className="user-info">
                    <img src={currentUser?.photoURL} alt="Profile" className="avatar" />
                    <div>
                        <h2>{currentUser?.displayName}</h2>
                        <p>{currentUser?.email}</p>
                    </div>
                </div>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
                Log Out
            </button>
            <div className="user-reviews-section">
                <h2>My Reviews</h2>
                {userReviews.length === 0 ? (
                    <p className="no-reviews-message">You haven't written any reviews yet.</p>
                ) : (
                    <div className="user-reviews-list">
                        {userReviews.map((review, index) => (
                            <Review 
                                key={index} 
                                review={review} 
                                updateReviewLikes={updateReviewLikes}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 