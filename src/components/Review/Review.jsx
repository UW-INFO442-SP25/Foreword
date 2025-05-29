import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Review.css';

export default function Review({ review, updateReviewLikes }) {
    const { 
        bookTitle, 
        author, 
        rating, 
        reviewText, 
        createdAt, 
        reviewerName = 'Anonymous',
        id,
        likes = [] 
    } = review;
    
    const { currentUser } = useAuth();
    const [likeCount, setLikeCount] = useState(likes.length);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        // check if the current user has already liked this review
        if (currentUser && likes) {
            setHasLiked(likes.includes(currentUser.uid));
        }
    }, [currentUser, likes]);

    const handleLike = () => {
        if (!currentUser) {
            alert("Please log in to like reviews");
            return;
        }

        if (hasLiked) {
            // user already liked this review - unlike it
            setLikeCount(prevCount => prevCount - 1);
            setHasLiked(false);
            // update the review in the app state
            updateReviewLikes(id, currentUser.uid, false);
        } else {
            // user has not liked this review - like it
            setLikeCount(prevCount => prevCount + 1);
            setHasLiked(true);
            // update the review in the app state
            updateReviewLikes(id, currentUser.uid, true);
        }
    };
    
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    };

    const formattedRating = typeof rating === 'number' ? rating.toFixed(1) : rating;

    return (
        <div className="review-item">
            <div className="review-rating">
                <span className="rating-number">{formattedRating}</span>
            </div>
            
            <h2 className="review-title">{bookTitle}</h2>
            <p className="review-author">by {author}</p>
            
            <p className="review-text">{reviewText}</p>
            
            <div className="review-footer">
                <div className="reviewer-info">
                    <div className="reviewer-name">
                        Review by {reviewerName}
                    </div>
                    <div className="review-date">
                        Posted on {formatDate(createdAt)}
                    </div>
                </div>
                
                <div className="review-likes">
                    <button 
                        className={`like-button ${hasLiked ? 'liked' : ''}`} 
                        onClick={handleLike}
                    >
                        <span className="heart-icon">❤</span>
                    </button>
                    <span className="like-count">{likeCount}</span>
                </div>
            </div>
        </div>
    );
} 