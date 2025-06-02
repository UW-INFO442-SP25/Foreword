import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, get, child } from 'firebase/database';
import { useAuth } from '../../contexts/AuthContext';
import { getProxiedImageUrl } from '../../utils/imageUtils';
import { Link } from 'react-router-dom';
import './FindFriends.css';

export default function FindFriends() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();

    useEffect(() => {
        async function fetchUsers() {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const dbRef = ref(db);

                // Get all users and following data in parallel
                const [usersSnapshot, followingSnapshot] = await Promise.all([
                    get(child(dbRef, 'users')),
                    get(child(dbRef, `follows/${currentUser.uid}`))
                ]);

                if (usersSnapshot.exists()) {
                    const usersData = usersSnapshot.val();
                    const followingData = followingSnapshot.exists() ? followingSnapshot.val() : {};
                    const followingIds = Object.keys(followingData);

                    const usersArray = Object.entries(usersData)
                        .filter(([uid, user]) =>
                            // Filter out current user and users already being followed
                            uid !== currentUser?.uid &&
                            !followingIds.includes(uid)
                        )
                        .map(([uid, user]) => ({
                            uid,
                            ...user
                        }));

                    setUsers(usersArray);
                } else {
                    console.log("No users found in database");
                    setUsers([]);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                setError('Error loading users. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, [currentUser]);

    if (loading) {
        return (
            <div className="find-friends-container">
                <h1>Find Friends</h1>
                <div className="loading-message">Loading users...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="find-friends-container">
                <h1>Find Friends</h1>
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="find-friends-container">
            <h1>Find Friends</h1>

            {users.length === 0 ? (
                <div className="no-users-message">
                    {!currentUser ? (
                        <p>Log in to find friends</p>
                    ) : (
                        <p>No new users to follow. Check back later!</p>
                    )}
                </div>
            ) : (
                <div className="users-list">
                    {users.map(user => (
                        <Link
                            to={`/user/${user.uid}`}
                            key={user.uid}
                            className="user-card"
                        >
                            {user.photoURL ? (
                                <img
                                    src={getProxiedImageUrl(user.photoURL)}
                                    alt={`${user.displayName || 'User'}'s profile`}
                                    className="user-avatar"
                                />
                            ) : (
                                <div className="user-avatar-placeholder">
                                    {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                                </div>
                            )}
                            <div className="user-info">
                                <h3>
                                    {user.displayName || 'Anonymous User'}
                                    {!user.public && <span className="private-badge">Private</span>}
                                </h3>
                                <p>{user.email}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

