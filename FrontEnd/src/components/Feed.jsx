import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import ProfileImage from './ProfileImage'
import TimeAgo from 'react-timeago'
import { FaRegCommentDots } from 'react-icons/fa'
import { IoMdShare } from "react-icons/io"
import LikeDislikePost from './LikeDislikePost'
import Trimtext from '../helpers/Trimtext'
import BookmarksPost from './BookmarksPost'
import { uiActions } from '../store/ui-slice'
import {HiDotsHorizontal} from "react-icons/hi"

const Feed = ({ post, onBookmarkChange, OnDeletePost}) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [creator, setCreator] = useState({})
    const [showFeedHeaderMenu, setShowFeedHeaderMenu] = useState(false)
    const token = useSelector(state => state.user.currentUser?.token)
    const userId = useSelector(state => state.user?.currentUser?.id)
    const location = useLocation()
    const dispatch= useDispatch()
    
    // Fetch creator data
    const getCreator = async (creatorId) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_Backend_api_url}/users/${creatorId}`,
                { 
                    withCredentials: true, 
                    headers: { Authorization: `Bearer ${token}` } 
                }
            )
            setCreator(response?.data)
        } catch (err) {
            console.error("Failed to fetch creator:", err)
        }
    }

    // Fetch current user data
    const getCurrentUser = async () => {
        try {
            if (!userId) return
            const response = await axios.get(
                `${import.meta.env.VITE_Backend_api_url}/users/${userId}`,
                { 
                    withCredentials: true, 
                    headers: { Authorization: `Bearer ${token}` } 
                }
            )
            setCurrentUser(response.data.user || response.data)
        } catch (err) {
            console.error("Failed to fetch current user:", err)
        }
    }

    const closeFeedHeaderMenu=()=> {
          setShowFeedHeaderMenu(false)
    }

    const showEditPostModal =()=> {
      
          dispatch(uiActions.openEditPostModal(post?._id))
          closeFeedHeaderMenu()

    }

    const deletePost =()=> {
        OnDeletePost(post?._id);
        closeFeedHeaderMenu()
    }

    // Effects with proper dependencies
    useEffect(() => {
        if (post?.creator) {
            getCreator(post.creator)
        }
    }, [post?.creator, token]) // Re-run when creator ID or token changes

    useEffect(() => {
       
        let isMounted = true
        
        if (userId) {
            getCurrentUser()
        }

        return () => {
            isMounted = false
        }
    }, [userId, token, post?._id]) // Re-run when user ID, token, or post ID changes

    const handleBookmarkUpdate = async () => {
        await getCurrentUser() // Refresh current user data
        onBookmarkChange?.() // Notify parent component if needed
    }

    return (
        <article className='feed'>
            <header className='feed__header'>
                <Link to={`/users/${post.creator}`} className='feed__header-profile'>
                    <ProfileImage image={creator?.user?.profilePhoto} />
                    <div className='feed__header-details'>
                        <h4>{creator?.user?.fullName}</h4>
                        <small><TimeAgo date={post?.createdAt} /></small>
                    </div>
                </Link>
                
                {showFeedHeaderMenu && userId === post?.creator && location.pathname.includes('users') && 
                    <menu className='feed__header-menu'>
                        <button onClick={showEditPostModal}>Edit</button>
                        <button onClick={deletePost}>Delete</button>
                    </menu>}
                    {userId== post.creator && location.pathname.includes("users") &&
      <button onClick={()=>setShowFeedHeaderMenu(!showFeedHeaderMenu)}><HiDotsHorizontal/></button>}
             
            </header>

            <Link to={`/posts/${post?._id}`} className='feed__body'>
                <p><Trimtext item={post?.body} maxLength={100} /></p>
                {post?.image && (
                    <div className='feed__images'>
                        <img src={post?.image} alt='post' loading='lazy' />
                    </div>
                )}
            </Link>

            <footer className='feed__footer'>
                <div>
                    <LikeDislikePost post={post} />
                    <button className='feed__footer-comments'>
                        <Link to={`/posts/${post._id}`}>
                            <FaRegCommentDots />
                        </Link>
                        <small>{post?.comments?.length}</small>
                    </button>
                    <button className='feed__footer-share'>
                        <IoMdShare />
                    </button>
                </div>
                <BookmarksPost 
                    post={post} 
                    currentUser={currentUser} 
                    onBookmarkChange={handleBookmarkUpdate}
                />
            </footer>
        </article>
    )
}

export default Feed