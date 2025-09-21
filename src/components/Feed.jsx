import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { addFeed } from '../utils/feedSlice';
import UserCard from './userCard';

const Feed = () => {
    const feed = useSelector((store) => store.feed);
    const dispatch = useDispatch();

    const getFeed = async()=>{
        if (feed) return;
        try {
            const res = await axios.get(BASE_URL+"/feed", {withCredentials: true});
            dispatch(addFeed(res?.data?.data));
        } catch (error) {
            console.log("Error while fetching feed", error);
        }
    };

    useEffect(()=>{
        getFeed();
    }, []);

  return (
    feed && 
    <UserCard user={feed[0]} />
  )
}

export default Feed
