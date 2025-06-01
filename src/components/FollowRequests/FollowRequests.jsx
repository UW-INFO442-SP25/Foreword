import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { ref, get, set, remove } from 'firebase/database';
import { getProxiedImageUrl } from '../../utils/imageUtils';
import './FollowRequests.css';

export default function FollowRequests() {
    const { currentUser } = useAuth();
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadRequests = async () => {
            if (!currentUser) return;

            try {
                const requestsRef = ref(db, `followRequests/${currentUser.uid}`);
                const requestsSnapshot = await get(requestsRef);

                if (requestsSnapshot.exists()) {
                    const requestsData = requestsSnapshot.val();
                    const requestsList = Object.entries(requestsData)
                        .filter(([_, request]) => request.status === 'pending')
                        .map(async ([requesterId, request]) => {
                            const userRef = ref(db, `users/${requesterId}`);
                            const userSnapshot = await get(userRef);
                            return {
                                id: requesterId,
                                ...userSnapshot.val(),
                                timestamp: request.timestamp
                            };
                        });

                    const resolvedRequests = await Promise.all(requestsList);
                    setRequests(resolvedRequests.sort((a, b) => b.timestamp - a.timestamp));
                }
            } catch (error) {
                setError('Error loading follow requests: ' + error.message);
            }
        };

        loadRequests();
    }, [currentUser]);

    const handleRequest = async (requesterId, action) => {
        if (!currentUser) return;

        try {
            if (action === 'accept') {
                // Add to followers
                const followerRef = ref(db, `followers/${currentUser.uid}/${requesterId}`);
                await set(followerRef, {
                    timestamp: Date.now()
                });

                // Add to requester's following
                const followingRef = ref(db, `follows/${requesterId}/${currentUser.uid}`);
                await set(followingRef, {
                    timestamp: Date.now()
                });
            }

            // Remove the request
            const requestRef = ref(db, `followRequests/${currentUser.uid}/${requesterId}`);
            await remove(requestRef);

            // Update local state
            setRequests(prevRequests =>
                prevRequests.filter(request => request.id !== requesterId)
            );
        } catch (error) {
            setError('Error processing request: ' + error.message);
        }
    };

    if (!currentUser) {
        return null;
    }

    return (
        <div className="follow-requests">
            <h2>Follow Requests</h2>
            {error && <div className="error-message">{error}</div>}
            {requests.length === 0 ? (
                <p className="no-requests">No pending follow requests</p>
            ) : (
                <div className="requests-list">
                    {requests.map(request => (
                        <div key={request.id} className="request-item">
                            <div className="request-user">
                                <img 
                                    src={getProxiedImageUrl(request.photoURL)} 
                                    alt={request.displayName} 
                                    className="request-avatar" 
                                />
                                <div className="request-info">
                                    <h3>{request.displayName}</h3>
                                    <p>{request.email}</p>
                                </div>
                            </div>
                            <div className="request-actions">
                                <button
                                    className="accept-button"
                                    onClick={() => handleRequest(request.id, 'accept')}
                                >
                                    Accept
                                </button>
                                <button
                                    className="reject-button"
                                    onClick={() => handleRequest(request.id, 'reject')}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}