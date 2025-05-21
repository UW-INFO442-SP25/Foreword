import React from 'react';

export default function Review({ review }) {
    const { bookTitle, author, rating, reviewText, createdAt } = review;
    
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    };

    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            backgroundColor: 'white',
        }}>
            <h2 style={{ margin: '0 0 8px 0' }}>{bookTitle}</h2>
            <p style={{ margin: '0 0 12px 0', color: '#666' }}>by {author}</p>
            
            <div style={{ margin: '8px 0' }}>
                <span>Rating: {rating}/10</span>
            </div>
            
            <p style={{ margin: '16px 0' }}>{reviewText}</p>
            
            <div style={{ fontSize: '0.8rem', color: '#888', textAlign: 'right' }}>
                Posted on {formatDate(createdAt)}
            </div>
        </div>
    );
}