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

                if (!followingSnapshot.exists()) {
                    setFollowingReviews([]);
                    return;
                }

                const followingUsers = Object.keys(followingSnapshot.val());

                // Filter reviews to only include those from followed users
                const filteredReviews = reviews.filter(review =>
                    followingUsers.includes(review.reviewerId)
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
                        <p>No reviews from followed users yet. Follow some friends to see their reviews!</p>
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