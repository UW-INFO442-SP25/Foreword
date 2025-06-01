import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { ref, onValue, set, get } from 'firebase/database';
import Review from '../Review/Review';
import FollowRequests from '../FollowRequests/FollowRequests';
import './Account.css';

export default function Account({ updateReviewLikes }) {
    const [error, setError] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [userReviews, setUserReviews] = useState([]);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            // Listen for changes to the user's public status
            const userRef = ref(db, `users/${currentUser.uid}`);
            const unsubscribe = onValue(userRef, async (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setIsPublic(data.public || false);

                    // Get user's reviews
                    if (data.reviewIds && Array.isArray(data.reviewIds)) {
                        const reviewsRef = ref(db, 'reviews');
                        const reviewsSnapshot = await get(reviewsRef);
                        if (reviewsSnapshot.exists()) {
                            const allReviews = reviewsSnapshot.val();
                            // Get all reviews by this user, regardless of public status
                            const userReviewsList = data.reviewIds
                                .map(id => allReviews[id])
                                .filter(review => review) // Filter out any undefined reviews
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first
                            setUserReviews(userReviewsList);
                        }
                    }
                }
            });

            return () => unsubscribe();
        }
    }, [currentUser]);

    async function handleLogout() {
        setError('');

        try {
            await logout();
            navigate('/login');
        } catch (error) {
            setError('Failed to log out: ' + error.message);
        }
    }

    async function handleTogglePrivate() {
        if (!currentUser) return;

        try {
            const userRef = ref(db, `users/${currentUser.uid}`);
            // Only save the essential user data
            await set(userRef, {
                displayName: currentUser.displayName,
                email: currentUser.email,
                photoURL: currentUser.photoURL,
                uid: currentUser.uid,
                public: !isPublic,
                reviewIds: userReviews.map(review => review.id) // Preserve review IDs
            });
        } catch (error) {
            setError('Failed to update privacy settings: ' + error.message);
        }
    }

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
            <div className="switch-container">
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={handleTogglePrivate}
                    />
                    <span className="slider round"></span>
                    <span className="switch-label">
                        {isPublic ? 'Public Account' : 'Private Account'}
                    </span>
                </label>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
                Log Out
            </button>

            <FollowRequests />

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