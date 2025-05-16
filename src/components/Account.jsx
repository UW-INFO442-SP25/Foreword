import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Account() {
    const [error, setError] = useState('');
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        setError('');

        try {
            await logout();
            navigate('/login');
        } catch (error) {
            setError('Failed to log out: ' + error.message);
        }
    }

    return (
        <div className="account-container">
            <h1>My Account</h1>
            {error && <div className="error">{error}</div>}
            <div className="profile-card">
                <div className="user-info">
                    <img src={currentUser?.photoURL} alt="Profile" className="avatar" />
                    <div>
                        <h2>{currentUser?.displayName}</h2>
                        <p>{currentUser?.email}</p>
                    </div>
                </div>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
                Log Out
            </button>
        </div>
    );
}
