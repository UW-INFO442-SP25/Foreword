import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateReview({ addReview }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        bookTitle: '',
        author: '',
        rating: 7,
        reviewText: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: name === 'rating' ? parseInt(value) : value
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
            createdAt: new Date().toISOString()
        };
        
        addReview(newReview);
        navigate('/home');
        console.log("Review submitted, redirecting to home page");
    };

    return (
        <div className="create-review-container">
            <h1>Write a Book Review</h1>
            
            {error && <div className="error">{error}</div>}
            
            <form onSubmit={handleSubmit} className="review-form">
                <div className="form-group">
                    <label htmlFor="bookTitle">Book Title</label>
                    <input
                        type="text"
                        id="bookTitle"
                        name="bookTitle"
                        value={formData.bookTitle}
                        onChange={handleChange}
                        placeholder="Enter the book title"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="author">Author</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        placeholder="Enter the author's name"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Rating (1-10): {formData.rating}</label>
                    <input
                        type="range"
                        name="rating"
                        min="1"
                        max="10"
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
                
                <div className="form-buttons">
                    <button type="button" onClick={() => navigate('/home')}>
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
