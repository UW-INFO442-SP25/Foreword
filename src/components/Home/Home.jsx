import React from 'react';
import { Link } from 'react-router-dom';
import Review from '../Review/Review';
import './Home.css';

export default function Home({ reviews = [] }) {
    return (
        <div className="home-container">
            <div className="home-header">
                <h1>Latest Reviews</h1>
                {/* <Link to="/CreateReview" className="create-review-btn">Write a Review</Link> */}
            </div>
            
            {reviews.length === 0 ? (
                <div className="no-reviews">
                    <p>No reviews yet. Be the first to share your thoughts!</p>
                </div>
            ) : (
                <div className="reviews-list">
                    {reviews.map((review, index) => (
                        <Review key={index} review={review} />
                    ))}
                </div>
            )}
        </div>
    );
} 