import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { addFeed } from '../utils/feedSlice';
import UserCard from './UserCard';

const Feed = () => {
    const feed = useSelector((store) => store.feed);
    const dispatch = useDispatch();

    const getFeed = async () => {
        // Only fetch if the feed is empty or null, to avoid unnecessary API calls
        if (feed && feed.length > 0) return; 
        try {
            const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
            // Assuming res.data.data is the array of users
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
    }, [feed]); // Added 'feed' to dependencies to re-run if state changes to empty/null

    // Conditional rendering to handle different states
    if (!feed) {
        // Show a simple loading indicator
        return <div className="flex justify-center items-center h-screen text-white">Loading feed...</div>;
    }

    if (feed.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-white p-6 bg-gray-900">
                <p className="text-3xl font-bold text-teal-400 mb-4">Welcome to DevConnect! 🎉</p>
                <p className="text-xl text-gray-300 mb-2">Your feed is empty right now.</p>
                
                {/* 🚀 UX IMPROVEMENT: Provide action steps */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center mt-4 max-w-md w-full">
                    <p className="text-lg text-white mb-3">Here's what you can do:</p>
                    <ul className="list-disc list-inside text-left mx-auto max-w-xs space-y-2 text-gray-400">
                        <li>**Complete your Profile:** Add skills and a detailed bio to help others find you.</li>
                        <li>**Check Requests:** See if anyone has already sent you an "Interested" request.</li>
                        <li>**Wait a bit:** New users join all the time! Check back later for fresh connections.</li>
                    </ul>
                </div>
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