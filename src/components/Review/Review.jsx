import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Review.css';

export default function Review({ review }) {
    const navigate = useNavigate();
    const {
        id,
        bookTitle,
        author,
        rating,
        reviewText,
        createdAt,
        reviewerName = 'Anonymous',
        coverUrl,
        reviewerId,
        likes = {}
    } = review;

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    };

    const formattedRating = typeof rating === 'number' ? rating.toFixed(1) : rating;
    const likeCount = Object.keys(likes).length;

    const handleReviewClick = () => {
        navigate(`/review/${id}`);
    };

    return (
        <div className="review-item" onClick={handleReviewClick}>
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
                            Review by {reviewerId ? (
                                <Link to={`/user/${reviewerId}`} className="reviewer-link" onClick={(e) => e.stopPropagation()}>
                                    {reviewerName}
                                </Link>
                            ) : reviewerName}
                        </div>
                        <div className="review-date">
                            Posted on {formatDate(createdAt)}
                        </div>
                    </div>
                    {likeCount > 0 && (
                        <div className="review-likes">
                            ❤️ {likeCount}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}