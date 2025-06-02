import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { ref, get, update, push, set } from 'firebase/database';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './ReviewDetail.css';

export default function ReviewDetail() {
    const { reviewId } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [review, setReview] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadReviewData = async () => {
            try {
                setLoading(true);
                const reviewRef = ref(db, `reviews/${reviewId}`);
                const reviewSnapshot = await get(reviewRef);

                if (!reviewSnapshot.exists()) {
                    setError('Review not found');
                    return;
                }

                const reviewData = reviewSnapshot.val();
                setReview(reviewData);

                // Load comments
                const commentsRef = ref(db, `comments/${reviewId}`);
                const commentsSnapshot = await get(commentsRef);
                if (commentsSnapshot.exists()) {
                    const commentsData = commentsSnapshot.val();
                    const commentsArray = Object.entries(commentsData).map(([id, comment]) => ({
                        id,
                        ...comment
                    }));
                    commentsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setComments(commentsArray);
                }
            } catch (error) {
                setError('Error loading review: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        loadReviewData();
    }, [reviewId]);

    const handleLike = async () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        try {
            const reviewRef = ref(db, `reviews/${reviewId}`);
            const reviewSnapshot = await get(reviewRef);
            const reviewData = reviewSnapshot.val();

            const likes = reviewData.likes || {};
            const hasLiked = likes[currentUser.uid];

            if (hasLiked) {
                delete likes[currentUser.uid];
            } else {
                likes[currentUser.uid] = true;
            }

            await update(reviewRef, { likes });
            setReview(prev => ({
                ...prev,
                likes
            }));
        } catch (error) {
            console.error('Error updating like:', error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            navigate('/login');
            return;
        }

        if (!newComment.trim()) return;

        try {
            const commentRef = ref(db, `comments/${reviewId}`);
            const newCommentRef = push(commentRef);

            const commentData = {
                text: newComment.trim(),
                userId: currentUser.uid,
                userName: currentUser.displayName || 'Anonymous',
                createdAt: new Date().toISOString()
            };

            await set(newCommentRef, commentData);
            setComments(prev => [{
                id: newCommentRef.key,
                ...commentData
            }, ...prev]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleBookClick = () => {
        if (review?.bookId) {
            navigate(`/book/${review.bookId}`);
        }
    };

    if (loading) {
        return <div className="review-detail-container">Loading...</div>;
    }

    if (error) {
        return <div className="review-detail-container error">{error}</div>;
    }

    if (!review) {
        return <div className="review-detail-container">Review not found</div>;
    }

    const likeCount = review.likes ? Object.keys(review.likes).length : 0;
    const hasLiked = review.likes && review.likes[currentUser?.uid];

    return (
        <div className="review-detail-container">
            <div className="review-detail">
                <div className="review-header">
                    <div
                        className="review-cover clickable"
                        onClick={handleBookClick}
                        title="Click to view book details"
                    >
                        {review.coverUrl ? (
                            <img
                                src={review.coverUrl}
                                alt={`Cover for ${review.bookTitle}`}
                                className="book-cover-image"
                            />
                        ) : (
                            <div className="book-cover-placeholder">
                                No Cover
                            </div>
                        )}
                    </div>
                    <div className="review-content">
                        <h1
                            className="review-title clickable"
                            onClick={handleBookClick}
                            title="Click to view book details"
                        >
                            {review.bookTitle}
                        </h1>
                        <p className="review-author">by {review.author}</p>
                        <div className="review-rating">
                            <span className="rating-number">{review.rating.toFixed(1)}</span>
                        </div>
                        <div className="reviewer-info">
                            <p className="reviewer-name">
                                Review by <Link to={`/user/${review.reviewerId}`} className="reviewer-link">{review.reviewerName}</Link>
                            </p>
                            <span className="review-date">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="review-text">{review.reviewText}</div>

                <div className="review-actions">
                    <button
                        className={`like-button ${hasLiked ? 'liked' : ''}`}
                        onClick={handleLike}
                    >
                        ❤️ {likeCount}
                    </button>
                </div>

                <div className="comments-section">
                    <h2>Comments</h2>
                    <form onSubmit={handleComment} className="comment-form">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            required
                        />
                        <button type="submit">Post Comment</button>
                    </form>

                    <div className="comments-list">
                        {comments.length === 0 ? (
                            <p className="no-comments">No comments yet. Be the first to comment!</p>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} className="comment">
                                    <div className="comment-header">
                                        <Link to={`/user/${comment.userId}`} className="commenter-name">
                                            {comment.userName}
                                        </Link>
                                        <span className="comment-date">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="comment-text">{comment.text}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}