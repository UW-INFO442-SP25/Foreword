import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './CreateReview.css';

export default function CreateReview({ addReview }) {
    const navigate = useNavigate();
    const location = useLocation();
    const bookData = location.state || {};
    const { currentUser } = useAuth();
    
    const [formData, setFormData] = useState({
        bookId: bookData.bookId || '',
        bookTitle: bookData.bookTitle || '',
        author: bookData.author || '',
        coverUrl: bookData.coverUrl || '',
        rating: 7.0,
        reviewText: '',
        reviewerName: currentUser?.displayName || 'Anonymous',
        reviewerEmail: currentUser?.email || ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        // Update form data if location state changes
        if (location.state) {
            setFormData(prevData => ({
                ...prevData,
                bookId: location.state.bookId || prevData.bookId,
                bookTitle: location.state.bookTitle || prevData.bookTitle,
                author: location.state.author || prevData.author,
                coverUrl: location.state.coverUrl || prevData.coverUrl
            }));
        }
    }, [location.state]);

    // Update reviewer information if user changes
    useEffect(() => {
        if (currentUser) {
            setFormData(prevData => ({
                ...prevData,
                reviewerName: currentUser.displayName || 'Anonymous',
                reviewerEmail: currentUser.email || ''
            }));
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: name === 'rating' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.bookTitle || !formData.author || !formData.reviewText) {
            setError('All fields are required');
            return;
        }
        
        const newReview = {
            ...formData,
            createdAt: new Date().toISOString(),
            // Ensure reviewer information is up to date
            reviewerName: currentUser?.displayName || 'Anonymous',
            reviewerEmail: currentUser?.email || '',
            reviewerId: currentUser?.uid || ''
        };
        
        addReview(newReview);
        
        // Navigate back to the book detail page if we came from there
        if (formData.bookId) {
            navigate(`/book/${formData.bookId}`);
        } else {
            navigate('/home');
        }
    };

    // If we don't have book information, show a message
    if (!formData.bookTitle || !formData.author) {
        return (
            <div className="create-review-container">
                <div className="error">
                    Missing book information. Please select a book to review.
                </div>
                <button 
                    className="form-buttons button"
                    onClick={() => navigate('/InputBook')}
                >
                    Search for a book
                </button>
            </div>
        );
    }

    return (
        <div className="create-review-container">
            <h1>Write a Book Review</h1>
            
            {error && <div className="error">{error}</div>}
            
            <form onSubmit={handleSubmit} className="review-form">
                {/* Static Book Information Display */}
                <div className="book-info-container">
                    {formData.coverUrl ? (
                        <img 
                            src={formData.coverUrl} 
                            alt={`Cover of ${formData.bookTitle}`} 
                            className="book-cover" 
                        />
                    ) : (
                        <div className="book-cover-placeholder">
                            No cover available
                        </div>
                    )}
                    
                    <div className="book-details">
                        <h2 className="book-title-static">{formData.bookTitle}</h2>
                        <p className="book-author-static">by {formData.author}</p>
                    </div>
                </div>
                
                <div className="form-group">
                    <label>Rating (1.0-10.0): {formData.rating.toFixed(1)}</label>
                    <input
                        type="range"
                        name="rating"
                        min="1.0"
                        max="10.0"
                        step="0.1"
                        value={formData.rating}
                        onChange={handleChange}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="reviewText">Your Review</label>
                    <textarea
                        id="reviewText"
                        name="reviewText"
                        rows="6"
                        value={formData.reviewText}
                        onChange={handleChange}
                        placeholder="Share your thoughts about this book"
                        required
                    ></textarea>
                </div>
                
                <div className="form-group">
                    <p className="reviewer-info">Posting as: <strong>{formData.reviewerName}</strong></p>
                </div>
                
                <div className="form-buttons">
                    <button 
                        type="button" 
                        onClick={() => formData.bookId ? navigate(`/book/${formData.bookId}`) : navigate('/home')}
                    >
                        Cancel
                    </button>
                    <button type="submit">
                        Submit Review
                    </button>
                </div>
            </form>
        </div>
    );
} 