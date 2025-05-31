// BookmarksPost.jsx
import React, { useEffect, useState } from 'react'
import { FaBookmark, FaRegBookmark } from "react-icons/fa"
import { useSelector } from 'react-redux'
import axios from 'axios'

const BookmarksPost = ({ post, currentUser }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const token = useSelector(state => state.user?.currentUser?.token);

    // Sync isBookmarked with currentUser.bookmarks whenever they change
    useEffect(() => {
        if (currentUser?.bookmarks) {
            setIsBookmarked(currentUser.bookmarks.includes(post?._id));
        }
    }, [currentUser, post?._id]);

    const handleBookMark = async () => {
        try {
            // Optimistic update
            setIsBookmarked(!isBookmarked);
            
            // API call
            await axios.get(
                `${import.meta.env.VITE_Backend_api_url}/posts/${post?._id}/bookmark`,
                { withCredentials: true, headers: { Authorization: `Bearer ${token }` }}
            );
            
        } catch (err) {
            console.log(err);
            // Revert on error
            setIsBookmarked(!isBookmarked);
        }
    }

    return (
        <button className='feed__footer-comments' onClick={handleBookMark}>
            {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </button>
    )
}

export default BookmarksPost