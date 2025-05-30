import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, get, child } from 'firebase/database';
import { useAuth } from '../../contexts/AuthContext';
import './FindFriends.css';

export default function FindFriends() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        async function fetchUsers() {
            try {
                setLoading(true);
                const dbRef = ref(db);
                const snapshot = await get(child(dbRef, 'users'));
                
                if (snapshot.exists()) {
                    const usersData = snapshot.val();
                    const usersArray = Object.values(usersData);
                    
                    // filter out the current user
                    const filteredUsers = usersArray.filter(user => 
                        user.uid !== currentUser?.uid
                    );
                    
                    setUsers(filteredUsers);
                } else {
                    console.log("No users found in database");
                    setUsers([]);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchUsers();
    }, [currentUser]);

    return (
        <div className="find-friends-container">
            <h1>Find Friends</h1>

            {loading ? (
                <p className="loading-message">Loading users...</p>
            ) : users.length === 0 ? (
                <p className="no-users-message">No other users found.</p>
            ) : (
                <div className="users-list">
                    {users.map(user => (
                        <div key={user.uid} className="user-card">
                            {user.photoURL ? (
                                <img 
                                    src={user.photoURL} 
                                    alt={`${user.displayName || 'User'}'s profile`} 
                                    className="user-avatar" 
                                />
                            ) : (
                                <div className="user-avatar-placeholder">
                                    {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                                </div>
                            )}
                            <div className="user-info">
                                <h3>{user.displayName || 'Anonymous User'}</h3>
                                <p>{user.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

