import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getProxiedImageUrl } from '../../utils/imageUtils';
import './Navbar.css';
import forewordLogo from '../../imgs/foreword-logo.png';

export default function Navbar() {
    const { currentUser } = useAuth();

    return (
        <div className="navbar">
            <Link to="/" className="navbar-brand">
                <img src={forewordLogo} alt="Foreword" className="navbar-logo" />
            </Link>
            
            <nav>
                <Link to="/home">Home</Link>
                <Link to="/community">Community</Link>
                <Link to="/InputBook">Browse Books</Link>
                {currentUser ? (
                    <Link to="/account" className="profile-link">
                        {currentUser.photoURL ? (
                            <img 
                                src={getProxiedImageUrl(currentUser.photoURL)} 
                                alt="Profile" 
                                className="nav-profile-image" 
                            />
                        ) : (
                            <div className="nav-profile-placeholder">
                                {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                            </div>
                        )}
                    </Link>
                ) : (
                    <Link to="/login">Sign In</Link>
                )}
            </nav>
        </div>
    );
} 