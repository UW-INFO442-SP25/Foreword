import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getProxiedImageUrl } from '../../utils/imageUtils';
import './Navbar.css';
import forewordLogo from '../../imgs/foreword-logo.png';

export default function Navbar() {
    const { currentUser } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <div className="navbar">
            <Link to="/" className="navbar-brand">
                <img src={forewordLogo} alt="Foreword" className="navbar-logo" />
            </Link>
            
            <div className="hamburger-menu" onClick={toggleDropdown}>
                <div className="hamburger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            {isDropdownOpen && (
                <div className="dropdown-menu">
                    <Link to="/home" onClick={closeDropdown}>Home</Link>
                    <Link to="/community" onClick={closeDropdown}>Community</Link>
                    <Link to="/InputBook" onClick={closeDropdown}>Browse Books</Link>
                    {currentUser ? (
                        <Link to="/account" onClick={closeDropdown}>Profile</Link>
                    ) : (
                        <Link to="/login" onClick={closeDropdown}>Sign In</Link>
                    )}
                </div>
            )}
            
            <nav className="nav-links">
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