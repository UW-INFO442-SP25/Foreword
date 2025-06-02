import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { ref, get, set, remove } from 'firebase/database';
import './FollowSystem.css';

export default function FollowSystem({ targetUserId, isPublic }) {
    const { currentUser } = useAuth();
    const [followStatus, setFollowStatus] = useState(null); // 'following', 'requested', 'none'
    const [error, setError] = useState('');

    useEffect(() => {
        const checkFollowStatus = async () => {
            if (!currentUser || !targetUserId) return;

            try {
                const followRef = ref(db, `follows/${currentUser.uid}/${targetUserId}`);
                const requestRef = ref(db, `followRequests/${targetUserId}/${currentUser.uid}`);

                const [followSnapshot, requestSnapshot] = await Promise.all([
                    get(followRef),
                    get(requestRef)
                ]);

                if (followSnapshot.exists()) {
                    setFollowStatus('following');
                } else if (requestSnapshot.exists()) {
                    setFollowStatus('requested');
                } else {
                    setFollowStatus('none');
                }
            } catch (error) {
                setError('Error checking follow status: ' + error.message);
            }
        };

        checkFollowStatus();
    }, [currentUser, targetUserId]);

    const handleFollow = async () => {
        if (!currentUser || !targetUserId) return;

        try {
            if (isPublic) {
                // Direct follow for public accounts
                const followRef = ref(db, `follows/${currentUser.uid}/${targetUserId}`);
                await set(followRef, {
                    timestamp: Date.now()
                });

                // Add to target user's followers
                const followerRef = ref(db, `followers/${targetUserId}/${currentUser.uid}`);
                await set(followerRef, {
                    timestamp: Date.now()
                });

                setFollowStatus('following');
            } else {
                // Send follow request for private accounts
                const requestRef = ref(db, `followRequests/${targetUserId}/${currentUser.uid}`);
                await set(requestRef, {
                    timestamp: Date.now(),
                    status: 'pending'
                });
                setFollowStatus('requested');
            }
        } catch (error) {
            setError('Error following user: ' + error.message);
        }
    };

    const handleUnfollow = async () => {
        if (!currentUser || !targetUserId) return;

        try {
            // Remove from current user's following
            const followRef = ref(db, `follows/${currentUser.uid}/${targetUserId}`);
            await remove(followRef);

            // Remove from target user's followers
            const followerRef = ref(db, `followers/${targetUserId}/${currentUser.uid}`);
            await remove(followerRef);

            setFollowStatus('none');
        } catch (error) {
            setError('Error unfollowing user: ' + error.message);
        }
    };

    const handleCancelRequest = async () => {
        if (!currentUser || !targetUserId) return;

        try {
            const requestRef = ref(db, `followRequests/${targetUserId}/${currentUser.uid}`);
            await remove(requestRef);
            setFollowStatus('none');
        } catch (error) {
            setError('Error canceling request: ' + error.message);
        }
    };

    if (!currentUser || currentUser.uid === targetUserId) {
        return null; // Don't show follow button for own profile
    }

    return (
        <div className="follow-system">
            {error && <div className="error-message">{error}</div>}
            {followStatus === 'none' && (
                <button className="follow-button" onClick={handleFollow}>
                    Follow
                </button>
            )}
            {followStatus === 'following' && (
                <button className="unfollow-button" onClick={handleUnfollow}>
                    Unfollow
                </button>
            )}
            {followStatus === 'requested' && (
                <button className="requested-button" onClick={handleCancelRequest}>
                    Requested
                </button>
            )}
        </div>
    );
}