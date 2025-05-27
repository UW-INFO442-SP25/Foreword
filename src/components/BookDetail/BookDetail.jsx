import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Review from '../Review/Review';
import './BookDetail.css';

const BookDetail = ({ reviews = [] }) => {
    const { bookId } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

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
                };

                setBook(bookData);
            } catch (error) {
                console.error('Error fetching book details:', error);
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

    if (loading) {
        return <div className="book-detail-container">Loading book details...</div>;
    }

    if (!book) {
        return <div className="book-detail-container">Book not found</div>;
    }

    return (
        <div className="book-detail-container">
            <div className="book-detail-header">
                {book.coverUrl ? (
                    <img src={book.coverUrl} alt={`Cover for ${book.title}`} className="book-cover" />
                ) : (
                    <div className="book-cover-placeholder">No cover available</div>
                )}
                
                <div className="book-info">
                    <h1 className="book-title">{book.title}</h1>
                    <h2 className="book-author">by {book.author}</h2>
                    
                    <div className="book-meta">
                        <p>Published: {book.publishDate}</p>
                    </div>
                    
                    <p className="book-description">{book.description}</p>
                    
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
                </div>
            </div>
            
            <div className="reviews-section">
                <h2 className="reviews-heading">Reviews</h2>
                
                {bookReviews.length === 0 ? (
                    <div className="no-reviews-message">
                        No reviews yet for this book. Be the first to share your thoughts!
                    </div>
                ) : (
                    bookReviews.map((review, index) => (
                        <Review key={index} review={review} />
                    ))
                )}
            </div>
        </div>
    );
};

export default BookDetail;
