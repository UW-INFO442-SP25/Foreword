import React, { useState, useEffect } from 'react';
import Review from '../Review/Review';
import './Community.css';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { ref, get } from 'firebase/database';

export default function Community({ reviews = [], updateReviewLikes, currentUser }) {
    const [followingReviews, setFollowingReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadFollowingReviews = async () => {
            if (!currentUser) {
                setFollowingReviews([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Get the list of users the current user is following
                const followingRef = ref(db, `follows/${currentUser.uid}`);
                const followingSnapshot = await get(followingRef);

                // Get reviews from followed users and current user
                const followingUsers = followingSnapshot.exists()
                    ? [...Object.keys(followingSnapshot.val()), currentUser.uid]
                    : [currentUser.uid];

                // Filter reviews to include those from followed users and current user
                const filteredReviews = reviews.filter(review =>
                    followingUsers.includes(review.reviewerId)
                );

                // Sort reviews by date (newest first)
                filteredReviews.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );

                setFollowingReviews(filteredReviews);
            } catch (error) {
                console.error('Error loading following reviews:', error);
                setError('Error loading reviews from followed users');
            } finally {
                setLoading(false);
            }
        };

        loadFollowingReviews();
    }, [currentUser, reviews]);

    if (loading) {
        return (
            <div className="community-container">
                <div className="community-header">
                    <h1>Community</h1>
                    <Link to="/findfriends" className="find-friends-button">
                        <span className="button-icon">👥</span>
                        Find Friends
                    </Link>
                </div>
                <div className="loading-message">Loading reviews...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="community-container">
                <div className="community-header">
                    <h1>Community</h1>
                    <Link to="/findfriends" className="find-friends-button">
                        <span className="button-icon">👥</span>
                        Find Friends
                    </Link>
                </div>
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="community-container">
            <div className="community-header">
                <h1>Community</h1>
                <Link to="/findfriends" className="find-friends-button">
                    <span className="button-icon">👥</span>
                    Find Friends
                </Link>
            </div>
            {followingReviews.length === 0 ? (
                <div className="no-reviews">
                    {!currentUser ? (
                        <p>Log in to access Foreword</p>
                    ) : (
                        <p>No reviews yet. Be the first to share your thoughts!</p>
                    )}
                </div>
            ) : (
                <div className="reviews-list">
                    {followingReviews.map((review, index) => (
                        <Review
                            key={index}
                            review={review}
                            updateReviewLikes={updateReviewLikes}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}