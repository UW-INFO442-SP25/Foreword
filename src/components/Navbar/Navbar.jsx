import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getProxiedImageUrl } from '../../utils/imageUtils';
import './Navbar.css';
import forewordLogo from '../../imgs/foreword-logo.png';

export default function Navbar() {
    const { currentUser } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
     const location = useLocation();

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
                     <Link to="/home" onClick={closeDropdown} className={location.pathname === '/home' ? 'active' : ''}>Home</Link>
                    <Link to="/community" onClick={closeDropdown} className={location.pathname === '/community' ? 'active' : ''}>Community</Link>
                    <Link to="/InputBook" onClick={closeDropdown} className={location.pathname === '/InputBook' ? 'active' : ''}>Search Books</Link>
                    {currentUser ? (
                        <Link to="/account" onClick={closeDropdown}>Profile</Link>
                    ) : (
                        <Link to="/login" onClick={closeDropdown}>Sign In</Link>
                    )}
                </div>
            )}
            
            <nav className="nav-links">
                <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>Home</Link>
                <Link to="/community" className={location.pathname === '/community' ? 'active' : ''}>Community</Link>
                <Link to="/InputBook" className={location.pathname === '/InputBook' ? 'active' : ''}>Search Books</Link>
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