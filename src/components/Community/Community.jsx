import React from 'react';
import Review from '../Review/Review';
import './Community.css';
import { Link } from 'react-router-dom';

export default function Community({ reviews = [], updateReviewLikes }) {
    return (
        <div className="community-container">
            <div className="community-header">
                <h1>Community</h1>
                <Link to="/findfriends" className="find-friends-button">
                    <span className="button-icon">👥</span>
                    Find Friends
                </Link>
            </div>
            {reviews.length === 0 ? (
                <div className="no-reviews">
                    <p>No reviews yet. Be the first to share your thoughts!</p>
                </div>
            ) : (
                <div className="reviews-list">
                    {reviews.map((review, index) => (
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