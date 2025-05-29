import React from 'react';
import './FindFriends.css';

export default function FindFriends() {
    return (
        <div className="find-friends-container">
            <h1>Find Friends</h1>            
            <div className="search-section">
                <form className="search-form">
                    <input 
                        type="text" 
                        placeholder="Search by name or email" 
                        className="search-input"
                    />
                    <button type="submit" className="search-button">Search</button>
                </form>
            </div>
        </div>
    );
}

