import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { addFeed } from '../utils/feedSlice';
import UserCard from './userCard';

const Feed = () => {
    const feed = useSelector((store) => store.feed);
    const dispatch = useDispatch();

    const getFeed = async () => {
        if (feed) return;
        try {
            const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
            dispatch(addFeed(res?.data?.data));
        } catch (error) {
            console.log("Error while fetching feed", error);
        }
    };

    const removeUserFromFeed = (userId) => {
        const updatedFeed = feed.filter(user => user._id !== userId);
        dispatch(addFeed(updatedFeed));
    };

    const acceptUser = async (userId) => {
        try {
            await axios.post(BASE_URL + `/request/send/interested/${userId}`, {}, { withCredentials: true });
            removeUserFromFeed(userId);
        } catch (error) {
            console.log("Error while accepting user", error);
        }
    };

    const ignoreUser = async (userId) => {
        try {
            await axios.post(BASE_URL + `/request/send/ignored/${userId}`, {}, { withCredentials: true });
            removeUserFromFeed(userId);
        } catch (error) {
            console.log("Error while ignoring user", error);
        }
    };

    useEffect(() => {
        getFeed();
    }, []);

    // Conditional rendering to handle different states
    if (!feed) {
        // You could also add a loading spinner here
        return <div className="flex justify-center items-center h-screen text-white">Loading feed...</div>;
    }

    if (feed.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen text-white">
                <p>No more users in your feed. Check back later!</p>
            </div>
        );
    }

    // Render the first user in the feed
    const currentUser = feed[0];
    
    return (
        <UserCard
            user={currentUser}
            onAccept={() => acceptUser(currentUser._id)}
            onIgnore={() => ignoreUser(currentUser._id)}
        />
    );
};

export default Feed;