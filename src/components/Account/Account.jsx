import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { ref, onValue, set, get, remove } from 'firebase/database';
import Review from '../Review/Review';
import FollowRequests from '../FollowRequests/FollowRequests';
import { getProxiedImageUrl } from '../../utils/imageUtils';
import FollowLists from '../FollowLists/FollowLists';
import './Account.css';

export default function Account({ updateReviewLikes }) {
    const [error, setError] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [userReviews, setUserReviews] = useState([]);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [streak, setStreak] = useState(null);


    useEffect(() => {
        if (currentUser) {
            // Listen for changes to the user's public status
            const userRef = ref(db, `users/${currentUser.uid}`);
            const unsubscribe = onValue(userRef, async (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setIsPublic(data.public || false);
                    setStreak(data.streakCount || 0);

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

            // If switching to public, accept all pending follow requests
            if (!isPublic) {
                const requestsRef = ref(db, `followRequests/${currentUser.uid}`);
                const requestsSnapshot = await get(requestsRef);

                if (requestsSnapshot.exists()) {
                    const requestsData = requestsSnapshot.val();
                    const pendingRequests = Object.entries(requestsData)
                        .filter(([, request]) => request.status === 'pending');

                    // Process all pending requests
                    for (const [requesterId] of pendingRequests) {
                        // Add to followers
                        const followerRef = ref(db, `followers/${currentUser.uid}/${requesterId}`);
                        await set(followerRef, {
                            timestamp: Date.now()
                        });

                        // Add to requester's following
                        const followingRef = ref(db, `follows/${requesterId}/${currentUser.uid}`);
                        await set(followingRef, {
                            timestamp: Date.now()
                        });

                        // Remove the request
                        const requestRef = ref(db, `followRequests/${currentUser.uid}/${requesterId}`);
                        await remove(requestRef);
                    }
                }
            }

            // Update user's public status
            await set(userRef, {
                displayName: currentUser.displayName,
                email: currentUser.email,
                photoURL: currentUser.photoURL,
                uid: currentUser.uid,
                public: !isPublic,
                reviewIds: userReviews.map(review => review.id), // Preserve review IDs
                streakCount: 1,
                lastActivityDate: new Date().toISOString().split('T')[0]
            });

            // Reload the page if switching to public
            if (!isPublic) {
                window.location.reload();
            }
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
                    <img
                        src={getProxiedImageUrl(currentUser?.photoURL)}
                        alt="Profile"
                        className="avatar"
                    />
                    <div>
                        <h2>{currentUser?.displayName}</h2>
                        <p>{currentUser?.email}</p>
                        {streak > 0 && (
                        <div className="streak-badge">
                            🔥 {streak}-day streak
                        </div>
                        )}
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

            {!isPublic && <FollowRequests />}
            <FollowLists
                userId={currentUser.uid}
                isOwnProfile={true}
            />

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