import React from 'react';
import './Review.css';

export default function Review({ review }) {
    const { 
        bookTitle, 
        author, 
        rating, 
        reviewText, 
        createdAt, 
        reviewerName = 'Anonymous',
        coverUrl
    } = review;
    
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    };

    const formattedRating = typeof rating === 'number' ? rating.toFixed(1) : rating;

    return (
        <div className="review-item">
            <div className="review-cover">
                {coverUrl ? (
                    <img 
                        src={coverUrl} 
                        alt={`Cover for ${bookTitle}`} 
                        className="book-cover-image" 
                    />
                ) : (
                    <div className="book-cover-placeholder">
                        No Cover
                    </div>
                )}
            </div>
            
            <div className="review-content">
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
                </div>
            </div>
        </div>
    );
} 