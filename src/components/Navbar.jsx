import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
    const { currentUser } = useAuth();

    return (
        <div className="navbar">
            <Link to="/" className="navbar-brand">Foreword</Link>
            <nav>
                <Link to="/home">Home</Link>
                <Link to="/community">Community</Link>
                {currentUser ? (
                    <Link to="/account">Account</Link>
                ) : (
                    <Link to="/login">Sign In</Link>
                )}
            </nav>
        </div>
    );
}
