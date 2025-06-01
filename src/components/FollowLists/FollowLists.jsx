import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { ref, get, remove } from 'firebase/database';
import { Link } from 'react-router-dom';
import './FollowLists.css';

export default function FollowLists({ userId, isOwnProfile }) {
    const { currentUser } = useAuth();
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [activeTab, setActiveTab] = useState('followers');
    const [error, setError] = useState('');

    useEffect(() => {
        const loadFollowLists = async () => {
            try {
                // Load followers
                const followersRef = ref(db, `followers/${userId}`);
                const followersSnapshot = await get(followersRef);

                if (followersSnapshot.exists()) {
                    const followersData = followersSnapshot.val();
                    const followersList = await Promise.all(
                        Object.keys(followersData).map(async (followerId) => {
                            const userRef = ref(db, `users/${followerId}`);
                            const userSnapshot = await get(userRef);
                            return {
                                id: followerId,
                                ...userSnapshot.val(),
                                timestamp: followersData[followerId].timestamp
                            };
                        })
                    );
                    setFollowers(followersList.sort((a, b) => b.timestamp - a.timestamp));
                }

                // Load following
                const followingRef = ref(db, `follows/${userId}`);
                const followingSnapshot = await get(followingRef);

                if (followingSnapshot.exists()) {
                    const followingData = followingSnapshot.val();
                    const followingList = await Promise.all(
                        Object.keys(followingData).map(async (followingId) => {
                            const userRef = ref(db, `users/${followingId}`);
                            const userSnapshot = await get(userRef);
                            return {
                                id: followingId,
                                ...userSnapshot.val(),
                                timestamp: followingData[followingId].timestamp
                            };
                        })
                    );
                    setFollowing(followingList.sort((a, b) => b.timestamp - a.timestamp));
                }
            } catch (error) {
                setError('Error loading follow lists: ' + error.message);
            }
        };

        loadFollowLists();
    }, [userId]);

    const handleRemoveFollower = async (followerId) => {
        if (!isOwnProfile) return;

        try {
            // Remove from followers
            const followerRef = ref(db, `followers/${currentUser.uid}/${followerId}`);
            await remove(followerRef);

            // Remove from their following
            const followingRef = ref(db, `follows/${followerId}/${currentUser.uid}`);
            await remove(followingRef);

            // Update local state
            setFollowers(prevFollowers =>
                prevFollowers.filter(follower => follower.id !== followerId)
            );
        } catch (error) {
            setError('Error removing follower: ' + error.message);
        }
    };

    const handleUnfollow = async (followingId) => {
        try {
            // Remove from following
            const followingRef = ref(db, `follows/${currentUser.uid}/${followingId}`);
            await remove(followingRef);

            // Remove from their followers
            const followerRef = ref(db, `followers/${followingId}/${currentUser.uid}`);
            await remove(followerRef);

            // Update local state
            setFollowing(prevFollowing =>
                prevFollowing.filter(following => following.id !== followingId)
            );
        } catch (error) {
            setError('Error unfollowing user: ' + error.message);
        }
    };

    return (
        <div className="follow-lists">
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'followers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('followers')}
                >
                    Followers ({followers.length})
                </button>
                <button
                    className={`tab ${activeTab === 'following' ? 'active' : ''}`}
                    onClick={() => setActiveTab('following')}
                >
                    Following ({following.length})
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="list-container">
                {activeTab === 'followers' ? (
                    followers.length === 0 ? (
                        <p className="empty-message">No followers yet</p>
                    ) : (
                        <div className="users-list">
                            {followers.map(user => (
                                <div key={user.id} className="user-item">
                                    <Link to={`/user/${user.id}`} className="user-info">
                                        <img src={user.photoURL} alt={user.displayName} className="user-avatar" />
                                        <div>
                                            <h3>{user.displayName}</h3>
                                            <p>{user.email}</p>
                                        </div>
                                    </Link>
                                    {isOwnProfile && (
                                        <button
                                            className="remove-button"
                                            onClick={() => handleRemoveFollower(user.id)}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    following.length === 0 ? (
                        <p className="empty-message">Not following anyone</p>
                    ) : (
                        <div className="users-list">
                            {following.map(user => (
                                <div key={user.id} className="user-item">
                                    <Link to={`/user/${user.id}`} className="user-info">
                                        <img src={user.photoURL} alt={user.displayName} className="user-avatar" />
                                        <div>
                                            <h3>{user.displayName}</h3>
                                            <p>{user.email}</p>
                                        </div>
                                    </Link>
                                    <button
                                        className="unfollow-button"
                                        onClick={() => handleUnfollow(user.id)}
                                    >
                                        Unfollow
                                    </button>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}