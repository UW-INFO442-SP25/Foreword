import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Review from '../Review/Review';
import { useAuth } from '../../contexts/AuthContext';
import './BookDetail.css';

const BookDetail = ({ reviews = [] }) => {
    const { bookId } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                setLoading(true);

                const response = await fetch(`https://openlibrary.org/works/${bookId}.json`);
                const data = await response.json();

                let authorName = "Unknown";
                if (data.authors && data.authors[0]?.author) {
                    const authorKey = data.authors[0].author.key;
                    const authorResponse = await fetch(`https://openlibrary.org${authorKey}.json`);
                    const authorData = await authorResponse.json();
                    authorName = authorData.name || "Unknown";
                }

                const bookData = {
                    id: bookId,
                    title: data.title,
                    author: authorName,
                    coverUrl: data.covers ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg` : null,
                    publishDate: data.first_publish_date || "Unknown",
                    description: data.description?.value || data.description || "No description available",
                    subjects: data.subjects || [],
                    genres: data.subject_places || [],
                };

                setBook(bookData);
            } catch (error) {
                console.error('Error fetching book details:', error);
                setError('Error loading book details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        if (bookId) {
            fetchBookDetails();
        }
    }, [bookId]);

    const bookReviews = reviews.filter(review =>
        review.bookId === bookId ||
        (review.bookTitle && book && review.bookTitle.toLowerCase() === book.title?.toLowerCase())
    );

    const averageRating = bookReviews.length > 0
        ? (bookReviews.reduce((sum, review) => sum + review.rating, 0) / bookReviews.length).toFixed(1)
        : null;

    if (loading) {
        return <div className="book-detail-container">Loading book details...</div>;
    }

    if (error) {
        return <div className="book-detail-container error">{error}</div>;
    }

    if (!book) {
        return <div className="book-detail-container">Book not found</div>;
    }

    return (
        <div className="book-detail-container">
            <div className="book-detail-header">
                <div className="book-cover-section">
                    {book.coverUrl ? (
                        <img src={book.coverUrl} alt={`Cover for ${book.title}`} className="book-cover" />
                    ) : (
                        <div className="book-cover-placeholder">No cover available</div>
                    )}
                </div>

                <div className="book-info">
                    <h1 className="book-title">{book.title}</h1>
                    <h2 className="book-author">by {book.author}</h2>

                    <div className="book-meta">
                        <p>Published: {book.publishDate}</p>
                        {averageRating && (
                            <div className="average-rating">
                                <span className="rating-label">Average Rating:</span>
                                <span className="rating-value">{averageRating}</span>
                                <span className="rating-count">({bookReviews.length} reviews)</span>
                            </div>
                        )}
                    </div>

                    {book.genres.length > 0 && (
                        <div className="book-genres">
                            <h3>Genres</h3>
                            <div className="genre-tags">
                                {book.genres.slice(0, 5).map((genre, index) => (
                                    <span key={index} className="genre-tag">{genre}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="book-description">
                        <h3>Description</h3>
                        <p>{book.description}</p>
                    </div>

                    {currentUser ? (
                        <Link
                            to={`/CreateReview`}
                            state={{
                                bookId: book.id,
                                bookTitle: book.title,
                                author: book.author,
                                coverUrl: book.coverUrl
                            }}
                            className="create-review-btn"
                        >
                            Write a Review
                        </Link>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="create-review-btn"
                        >
                            Log in to Review
                        </button>
                    )}
                </div>
            </div>

            <div className="reviews-section">
                <div className="reviews-header">
                    <h2>Reviews</h2>
                    <span className="review-count">{bookReviews.length} reviews</span>
                </div>

                {bookReviews.length === 0 ? (
                    <div className="no-reviews-message">
                        No reviews yet for this book. Be the first to share your thoughts!
                    </div>
                ) : (
                    <div className="reviews-list">
                        {bookReviews.map((review, index) => (
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
};

export default BookDetail;
