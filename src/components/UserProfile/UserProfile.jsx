import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { ref, get } from 'firebase/database';
import { useAuth } from '../../contexts/AuthContext';
import Review from '../Review/Review';
import FollowSystem from '../FollowSystem/FollowSystem';
import FollowLists from '../FollowLists/FollowLists';
import { getProxiedImageUrl } from '../../utils/imageUtils';
import './UserProfile.css';

export default function UserProfile() {
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null);
    const [userReviews, setUserReviews] = useState([]);
    const { userId } = useParams();
    const { currentUser } = useAuth();

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userRef = ref(db, `users/${userId}`);
                const userSnapshot = await get(userRef);

                if (!userSnapshot.exists()) {
                    setError('User not found');
                    return;
                }

                const data = userSnapshot.val();
                setUserData(data);

                // Get user's reviews
                if (data.reviewIds && Array.isArray(data.reviewIds)) {
                    const reviewsRef = ref(db, 'reviews');
                    const reviewsSnapshot = await get(reviewsRef);
                    if (reviewsSnapshot.exists()) {
                        const allReviews = reviewsSnapshot.val();
                        // Get all public reviews by this user
                        const userReviewsList = data.reviewIds
                            .map(id => allReviews[id])
                            .filter(review => review && review.public) // Only show public reviews
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first
                        setUserReviews(userReviewsList);
                    }
                }
            } catch (error) {
                setError('Error loading user data: ' + error.message);
            }
        };

        loadUserData();
    }, [userId]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!userData) {
        return <div className="loading">Loading...</div>;
    }

    const isOwnProfile = currentUser && currentUser.uid === userId;
    const canViewContent = userData.public || isOwnProfile;

    return (
        <div className="user-profile-container">
            <h1>User Profile</h1>
            <div className="profile-card">
                <div className="user-info">
                    <img 
                        src={getProxiedImageUrl(userData.photoURL)} 
                        alt="Profile" 
                        className="avatar" 
                    />
                    <div>
                        <h2>{userData.displayName}</h2>
                        <p>{userData.email}</p>
                    </div>
                </div>
                {!isOwnProfile && (
                    <FollowSystem
                        targetUserId={userId}
                        isPublic={userData.public}
                    />
                )}
            </div>

            <FollowLists
                userId={userId}
                isOwnProfile={isOwnProfile}
            />

            <div className="user-reviews-section">
                <h2>Reviews</h2>
                {!canViewContent ? (
                    <p className="no-reviews-message">This user is private.</p>
                ) : userReviews.length === 0 ? (
                    <p className="no-reviews-message">No reviews yet.</p>
                ) : (
                    <div className="user-reviews-list">
                        {userReviews.map((review, index) => (
                            <Review
                                key={index}
                                review={review}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}